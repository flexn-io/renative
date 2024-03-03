import { logTask, logToSummary, executeTask, PARAMS, RnvTaskFn, RnvTask, TaskKey } from '@rnv/core';
import { getPluginList } from '../../plugins';

export const taskRnvPluginList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPluginList');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.pluginList, originTask);

    const o = getPluginList(c);

    // console.log(o.asString);
    logToSummary(`Plugins:\n\n${o.asString}`);

    return true;
};

const Task: RnvTask = {
    description: 'Show list of all available plugins',
    fn: taskRnvPluginList,
    task: TaskKey.pluginList,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
