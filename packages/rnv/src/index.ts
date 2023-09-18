import 'regenerator-runtime/runtime';
import 'source-map-support/register';
import { Analytics } from './analytics';
import {
    Context,
    RnvContext,
    RnvContextPrompt,
    RnvContextSpinner,
    checkAndBootstrapIfRequired,
    checkAndMigrateProject,
    configureFilesystem,
    configureRuntimeDefaults,
    createRnvConfig,
    doResolve,
    findSuitableTask,
    getConfigProp,
    initializeTask,
    isSystemWin,
    loadEngines,
    loadIntegrations,
    logInitialize,
    registerEngine,
    registerMissingPlatformEngines,
    updateRenativeConfigs,
} from '@rnv/core';

export * from './modules';
export * from './adapter';

const IGNORE_MISSING_ENGINES_TASKS = ['link', 'unlink'];

export const executeRnv = async ({
    cmd,
    subCmd,
    process,
    program,
    spinner,
    prompt,
}: {
    cmd: string;
    subCmd: string;
    process: any;
    program: any;
    spinner: RnvContextSpinner;
    prompt: RnvContextPrompt;
}) => {
    // set mono and ci if json is enabled
    if (program.json) {
        program.mono = true;
        program.ci = true;
    }

    Analytics.initialize();
    configureFilesystem(getConfigProp, doResolve, isSystemWin);
    const c = createRnvConfig(program, process, cmd, subCmd);
    logInitialize();

    //@ts-ignore
    global.fetch = await import('node-fetch');
    //@ts-ignore
    global.Headers = global.fetch.Headers;

    Context.initializeConfig(c);

    c.spinner = spinner;
    c.prompt = prompt;
    c.analytics = Analytics;

    await _executeRnv(c);

    return c;
};

const _executeRnv = async (c: RnvContext) => {
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
