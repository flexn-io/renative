import {
    configureRuntimeDefaults,
    updateRenativeConfigs,
    registerEngine,
    registerMissingPlatformEngines,
    loadEngines,
    checkAndMigrateProject,
    checkAndBootstrapIfRequired,
    loadIntegrations,
    initializeTask,
    findSuitableTask,
    RnvContext,
    Analytics,
    configureFilesystem,
    createRnvConfig,
    logInitialize,
    getConfigProp,
    doResolve,
    isSystemWin,
    Config,
    logComplete,
    logError,
} from 'rnv';
import Spinner from './ora';
import Prompt from './prompt';

const IGNORE_MISSING_ENGINES_TASKS = ['link', 'unlink'];

const CLI = async (c: RnvContext) => {
    c.spinner = Spinner;
    c.prompt = Prompt;
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

const initializeBuilder = async (cmd: string, subCmd: string, process: any, program: any) => {
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

    return c;
};

const run = (cmd: string, subCmd: string, program: any, process: any) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then((c) => Config.initializeConfig(c))
        .then((c) => CLI(c))
        .then(() => logComplete(!Config.getConfig().runtime.keepSessionActive))
        .catch((e) => logError(e, true));
};

export default { run };
