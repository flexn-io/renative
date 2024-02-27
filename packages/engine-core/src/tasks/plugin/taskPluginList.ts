import {
    logTask,
    logToSummary,
    executeTask,
    TASK_PLUGIN_LIST,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    RnvTask,
} from '@rnv/core';
import { getPluginList } from '../../plugins';

export const taskRnvPluginList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPluginList');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLUGIN_LIST, originTask);

    const o = getPluginList(c);

    // console.log(o.asString);
    logToSummary(`Plugins:\n\n${o.asString}`);

    return true;
};

const Task: RnvTask = {
    description: 'Show list of all available plugins',
    fn: taskRnvPluginList,
    task: TASK_PLUGIN_LIST,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
