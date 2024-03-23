import { logTask, logToSummary, executeTask, RnvTaskOptionPresets, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { getPluginList } from '../../plugins';

const taskPluginList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskPluginList');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.pluginList, originTask);

    const o = getPluginList();

    // console.log(o.asString);
    logToSummary(`Plugins:\n\n${o.asString}`);

    return true;
};

const Task: RnvTask = {
    description: 'Show list of all available plugins',
    fn: taskPluginList,
    task: RnvTaskName.pluginList,
    options: RnvTaskOptionPresets.withBase(),
};

export default Task;
