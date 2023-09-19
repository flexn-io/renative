import { Analytics } from './analytics';
import {
    RnvApiLogger,
    RnvApiPrompt,
    RnvApiSpinner,
    checkAndBootstrapIfRequired,
    checkAndMigrateProject,
    configureRuntimeDefaults,
    createRnvApi,
    createRnvContext,
    doResolve,
    findSuitableTask,
    getConfigProp,
    getContext,
    initializeTask,
    loadEngines,
    loadIntegrations,
    loadWorkspacesSync,
    logInitialize,
    registerEngine,
    registerMissingPlatformEngines,
    updateRenativeConfigs,
} from '@rnv/core';
import { RNV_HOME_DIR } from './constants';

const IGNORE_MISSING_ENGINES_TASKS = ['link', 'unlink'];

export const executeRnv = async ({
    cmd,
    subCmd,
    process,
    program,
    spinner,
    prompt,
    logger,
}: {
    cmd: string;
    subCmd: string;
    process: any;
    program: any;
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    logger: RnvApiLogger;
}) => {
    try {
        // set mono and ci if json is enabled
        if (program.json) {
            program.mono = true;
            program.ci = true;
        }

        //@ts-ignore
        global.fetch = await import('node-fetch');
        //@ts-ignore
        global.Headers = global.fetch.Headers;

        createRnvApi({ spinner, prompt, analytics: Analytics, logger, getConfigProp, doResolve });
        createRnvContext({ program, process, cmd, subCmd, RNV_HOME_DIR });

        logInitialize();
        loadWorkspacesSync();

        Analytics.initialize();

        await _executeRnv();
    } catch (e) {
        console.log(e);
        // logError(e);
    }
};

const _executeRnv = async () => {
    const c = getContext();
    const EngineCore = require('@rnv/engine-core').default;

    await registerEngine(c, EngineCore);
    await configureRuntimeDefaults(c);
    await checkAndMigrateProject();
    await updateRenativeConfigs(c);
    await checkAndBootstrapIfRequired(c);
    if (c.program.npxMode) {
        return;
    }
    await loadIntegrations(c);
    const result = await loadEngines(c);
    // If false make sure we reload configs as it's freshly installed
    if (!result) {
        await updateRenativeConfigs(c);
    }
    // for root rnv we simply load all engines upfront
    if (!c.command && c.paths.project.configExists) {
        await registerMissingPlatformEngines(c);
    }
    const taskInstance = await findSuitableTask(c);
    // Some tasks might require all engines to be present (ie rnv platforms list)
    if (c.command && !IGNORE_MISSING_ENGINES_TASKS.includes(c.command)) {
        await registerMissingPlatformEngines(c, taskInstance);
    }
    // Skip babel.config creation until template check
    // await checkAndCreateBabelConfig(c);
    if (taskInstance?.task) await initializeTask(c, taskInstance?.task);
};
