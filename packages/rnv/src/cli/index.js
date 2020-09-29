import { logTask } from '../core/systemManager/logger';
import { configureRuntimeDefaults, parseRenativeConfigs } from '../core/configManager/configParser';
import { initializeTask, findSuitableTask, registerEngine } from '../core/engineManager';
import { checkAndMigrateProject } from '../core/projectManager/migrator';

import EngineRn from '../engine-rn';
import EngineRnWeb from '../engine-rn-web';
import EngineRnElectron from '../engine-rn-electron';
import EngineRnNext from '../engine-rn-next';
import EngineCore from '../engine-core';

const registerEngines = () => {
    logTask('registerEngines');
    registerEngine(EngineCore);
    registerEngine(EngineRnWeb);
    registerEngine(EngineRnElectron);
    registerEngine(EngineRnNext);
    registerEngine(EngineRn);
};


const run = async (c) => {
    registerEngines();
    await configureRuntimeDefaults(c);
    await checkAndMigrateProject(c);
    await parseRenativeConfigs(c);

    const taskInstance = await findSuitableTask(c);

    await initializeTask(c, taskInstance.task);
};

export default run;
