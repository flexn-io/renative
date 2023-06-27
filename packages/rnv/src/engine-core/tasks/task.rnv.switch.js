import { logTask } from '../../core/systemManager/logger';
import { configureFonts, copyRuntimeAssets } from '../../core/projectManager';
import { generateRuntimeConfig } from '../../core/configManager';
import { executeTask } from '../../core/taskManager';
import { TASK_SWITCH, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';

export const taskRnvSwitch = async (c, parentTask, originTask) => {
    logTask('taskRnvSwitch');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_SWITCH, originTask);

    await copyRuntimeAssets(c);
    await generateRuntimeConfig(c);
    await configureFonts(c);

    return true;
};

export default {
    description: '',
    fn: taskRnvSwitch,
    task: TASK_SWITCH,
    params: PARAMS.withBase(),
    platforms: [],
};
