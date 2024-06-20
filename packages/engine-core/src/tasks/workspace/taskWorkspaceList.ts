import { generateOptions, chalk, logToSummary, createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Show list of all available workspaces',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const opts = generateOptions(
            ctx.files.dotRnv.configWorkspaces?.workspaces,
            true,
            null,
            (i, obj, mapping, defaultVal) => {
                const isConnected = '';
                return ` [${chalk().grey(i + 1)}]> ${chalk().bold.white(defaultVal)}${isConnected} \n`;
            }
        );

        logToSummary(`Workspaces:\n\n${opts.asString}`);
    },
    task: RnvTaskName.workspaceList,
    isGlobalScope: true,
});
