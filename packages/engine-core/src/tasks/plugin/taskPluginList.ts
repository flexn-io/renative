import { logToSummary, createTask, RnvTaskName } from '@rnv/core';
import { getPluginList } from './taskHelpers';

/**
 * CLI command `npx rnv plugin list` triggers this task, which show list of all available plugins.
 */
export default createTask({
    description: 'Show list of all available plugins',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        const o = getPluginList();
        logToSummary(`Plugins:\n\n${o.asString}`);
        return true;
    },
    task: RnvTaskName.pluginList,
});
