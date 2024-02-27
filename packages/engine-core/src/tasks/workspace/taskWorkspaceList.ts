import { generateOptions, chalk, logTask, logToSummary, executeTask, PARAMS, RnvTaskFn, RnvTask } from '@rnv/core';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';
import { TASK_WORKSPACE_LIST } from './constants';

export const taskRnvWorkspaceList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvWorkspaceList');

    if (c.paths.project.configExists) {
        await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_LIST, originTask);
    }

    const opts = generateOptions(
        c.files.rnv.configWorkspaces?.workspaces,
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
    fn: taskRnvWorkspaceList,
    task: TASK_WORKSPACE_LIST,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
