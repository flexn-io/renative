import { logToSummary, RnvTask, RnvTaskName } from '@rnv/core';
import { getPluginList } from '../../plugins';

const Task: RnvTask = {
    description: 'Show list of all available plugins',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        const o = getPluginList();
        logToSummary(`Plugins:\n\n${o.asString}`);
        return true;
    },
    task: RnvTaskName.pluginList,
};

export default Task;
