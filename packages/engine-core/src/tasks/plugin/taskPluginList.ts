import { logTask, logToSummary, executeTask, PARAMS, RnvTaskFn, RnvTask } from '@rnv/core';
import { getPluginList } from '../../plugins';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';
import { TASK_PLUGIN_LIST } from './constants';

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
