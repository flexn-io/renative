/* eslint-disable import/no-cycle */
import { setRuntimeDefaults, parseRenativeConfigs } from '../core/configManager/configParser';
import { initializeTask, findSuitableTask } from '../core/engineManager';
import { checkAndMigrateProject } from '../core/projectManager/migrator';

const run = async (c) => {
    setRuntimeDefaults(c);
    await checkAndMigrateProject(c);
    await parseRenativeConfigs(c);

    const taskInstance = await findSuitableTask(c);

    await initializeTask(c, taskInstance.task);
};

export default run;
