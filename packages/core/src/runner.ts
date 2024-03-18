import { getContext } from './context/provider';
import { loadEngines, registerMissingPlatformEngines } from './engines';
import { loadIntegrations } from './integrations';
import { checkAndMigrateProject } from './migrator';
import { configureRuntimeDefaults } from './context/runtime';
import { findSuitableGlobalTask, findSuitableTask, initializeTask } from './tasks';
import { updateRenativeConfigs } from './plugins';
import { checkAndBootstrapIfRequired } from './projects/bootstrap';
import { loadDefaultConfigTemplates } from './configs';

export const executeRnvCore = async () => {
    const c = getContext();

    await loadDefaultConfigTemplates();
    await configureRuntimeDefaults();
    await checkAndMigrateProject();
    await updateRenativeConfigs();
    await checkAndBootstrapIfRequired();

    // TODO: rename to something more meaningful or DEPRECATE entirely
    if (c.program.npxMode) {
        return;
    }

    // Special Case for engine-core tasks
    // they don't require other engines to be loaded if isGlobalScope = true
    // ie rnv link
    const initTask = await findSuitableGlobalTask();
    if (initTask?.task && initTask.isGlobalScope) {
        return initializeTask(initTask);
    }

    await loadIntegrations();
    const result = await loadEngines();
    // If false make sure we reload configs as it means it's freshly installed
    if (!result) {
        await updateRenativeConfigs();
    }

    // for root rnv we simply load all engines upfront
    const { configExists } = c.paths.project;
    if (!c.command && configExists) {
        await registerMissingPlatformEngines();
    }

    // Some tasks might require all engines to be present (ie rnv platform list)
    const taskInstance = await findSuitableTask();

    if (c.command && !taskInstance?.ignoreEngines) {
        await registerMissingPlatformEngines(taskInstance);
    }

    if (taskInstance?.task) await initializeTask(taskInstance);
};
