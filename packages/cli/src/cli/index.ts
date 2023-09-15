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
} from 'rnv';

const IGNORE_MISSING_ENGINES_TASKS = ['link', 'unlink'];

const run = async (c: RnvContext) => {
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

export default run;
