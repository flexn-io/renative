import { generateOptions } from '../../cli/prompt';
import { chalk, logTask, logToSummary } from '../../core/systemManager/logger';
import { executeTask } from '../../core/taskManager';
import { TASK_WORKSPACE_LIST, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { RnvTaskFn } from '../../core/taskManager/types';

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

export default {
    description: 'Show list of all available workspaces',
    fn: taskRnvWorkspaceList,
    task: TASK_WORKSPACE_LIST,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};
