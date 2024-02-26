import { getContext } from './context/provider';
import { loadEngines, registerMissingPlatformEngines } from './engines';
import { loadIntegrations } from './integrations';
import { checkAndMigrateProject } from './migrator';
import { checkAndBootstrapIfRequired } from './projects';
import { configureRuntimeDefaults } from './context/runtime';
import { findSuitableTask, initializeTask } from './tasks';
import { updateRenativeConfigs } from './plugins';

export const executeRnvCore = async () => {
    const c = getContext();

    await configureRuntimeDefaults(c);
    await checkAndMigrateProject();
    await updateRenativeConfigs(c);
    await checkAndBootstrapIfRequired(c);

    if (c.program.npxMode) {
        return;
    }
    await loadIntegrations(c);
    const result = await loadEngines(c);

    // If false make sure we reload configs as it means it's freshly installed
    if (!result) {
        await updateRenativeConfigs(c);
    }

    // for root rnv we simply load all engines upfront
    const { configExists } = c.paths.project;
    if (!c.command && configExists) {
        await registerMissingPlatformEngines(c);
    }

    // Some tasks might require all engines to be present (ie rnv platform list)
    const taskInstance = await findSuitableTask(c);
    if (c.command && !taskInstance?.ignoreEngines) {
        await registerMissingPlatformEngines(c, taskInstance);
    }

    if (taskInstance?.task) await initializeTask(c, taskInstance?.task);
};
