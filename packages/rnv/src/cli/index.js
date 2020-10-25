/* eslint-disable global-require */
import { parseRenativeConfigs } from '../core/configManager';
import { configureRuntimeDefaults } from '../core/configManager/runtimeParser';
import { initializeTask, findSuitableTask, registerEngine, registerPlatformEngine,
    loadEngineConfigs, registerMissingPlatformEngines } from '../core/engineManager';
import { checkAndMigrateProject } from '../core/projectManager/migrator';

import EngineCore from '../engine-core';

const run = async (c) => {
    await registerEngine(c, EngineCore);
    await configureRuntimeDefaults(c);
    await checkAndMigrateProject(c);
    await parseRenativeConfigs(c);
    const result = await loadEngineConfigs(c);
    if (!result) {
        await parseRenativeConfigs(c);
    }
    // Register only 1 active platfrom engine (-p) to improve performance
    await registerPlatformEngine(c, c.platform);
    const taskInstance = await findSuitableTask(c);
    // Some tasks might require all engines to be present (ie rnv platforms list)
    await registerMissingPlatformEngines(c, taskInstance);

    await initializeTask(c, taskInstance.task);
};

export default run;
