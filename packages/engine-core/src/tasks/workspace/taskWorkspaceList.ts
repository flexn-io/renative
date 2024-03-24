import { generateOptions, chalk, logTask, logToSummary, executeTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskWorkspaceList');

    if (c.paths.project.configExists) {
        await executeTask(RnvTaskName.projectConfigure, RnvTaskName.workspaceList, originTask);
    }

    const opts = generateOptions(
        c.files.dotRnv.configWorkspaces?.workspaces,
        true,
        null,
        (i, obj, mapping, defaultVal) => {
            const isConnected = '';
            return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)}${isConnected} \n`;
        }
    );

    logToSummary(`Workspaces:\n\n${opts.asString}`);
};

const Task: RnvTask = {
    description: 'Show list of all available workspaces',
    fn,
    task: RnvTaskName.workspaceList,
    isGlobalScope: true,
};

export default Task;
