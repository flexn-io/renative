/* eslint-disable global-require */
import { configureRuntimeDefaults, updateRenativeConfigs } from '../core/configManager/runtimeParser';
import { registerEngine, registerMissingPlatformEngines, loadEngines } from '../core/engineManager';
import { checkAndMigrateProject } from '../core/projectManager/migrator';
import { loadIntegrations } from '../core/integrationManager';
import { checkAndCreateBabelConfig } from '../core/projectManager';
import { initializeTask, findSuitableTask } from '../core/taskManager';

import EngineCore from '../engine-core';

const run = async (c) => {
    await registerEngine(c, EngineCore);
    await configureRuntimeDefaults(c);
    await checkAndMigrateProject(c);
    await updateRenativeConfigs(c);
    await loadIntegrations(c);
    const result = await loadEngines(c);
    // If false make sure we reload configs as it's freshly installed
    if (!result) {
        await updateRenativeConfigs(c);
    }
    const taskInstance = await findSuitableTask(c);
    // Some tasks might require all engines to be present (ie rnv platforms list)
    await registerMissingPlatformEngines(c, taskInstance);
    await checkAndCreateBabelConfig(c);
    await initializeTask(c, taskInstance.task);
};

export default run;
