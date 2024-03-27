import { generateOptions, chalk, logToSummary, RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'Show list of all available workspaces',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const opts = generateOptions(
            ctx.files.dotRnv.configWorkspaces?.workspaces,
            true,
            null,
            (i, obj, mapping, defaultVal) => {
                const isConnected = '';
                return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)}${isConnected} \n`;
            }
        );

        logToSummary(`Workspaces:\n\n${opts.asString}`);
    },
    task: RnvTaskName.workspaceList,
    isGlobalScope: true,
};

export default Task;
