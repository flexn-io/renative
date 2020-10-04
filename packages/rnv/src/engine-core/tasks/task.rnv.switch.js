import { logTask } from '../../core/systemManager/logger';
import { copyRuntimeAssets } from '../../core/projectManager/projectParser';
import { generateRuntimeConfig } from '../../core/configManager/configParser';
import { executeTask } from '../../core/engineManager';
import { TASK_SWITCH, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


export const taskRnvSwitch = async (c, parentTask, originTask) => {
    logTask('taskRnvSwitch');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_SWITCH, originTask);

    await copyRuntimeAssets(c);
    await generateRuntimeConfig(c);

    return true;
};

export default {
    description: '',
    fn: taskRnvSwitch,
    task: TASK_SWITCH,
    params: PARAMS.withBase(),
    platforms: [],
};
