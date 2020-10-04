import { logTask, logToSummary } from '../../core/systemManager/logger';
import { getPluginList } from '../../core/pluginManager';
import { executeTask } from '../../core/engineManager';
import { TASK_PLUGIN_LIST, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


export const taskRnvPluginList = async (c, parentTask, originTask) => {
    logTask('taskRnvPluginList');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLUGIN_LIST, originTask);

    const o = getPluginList(c);

    // console.log(o.asString);
    logToSummary(`Plugins:\n\n${o.asString}`);

    return true;
};

export default {
    description: 'Show list of all available plugins',
    fn: taskRnvPluginList,
    task: 'plugin list',
    params: PARAMS.withBase(),
    platforms: [],
};
