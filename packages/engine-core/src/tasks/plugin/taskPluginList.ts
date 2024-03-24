import { logTask, logToSummary, executeTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { getPluginList } from '../../plugins';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskPluginList');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.pluginList, originTask);

    const o = getPluginList();
    logToSummary(`Plugins:\n\n${o.asString}`);
    return true;
};

const Task: RnvTask = {
    description: 'Show list of all available plugins',
    fn,
    task: RnvTaskName.pluginList,
};

export default Task;
