import { logTask, executeTask, PARAMS, RnvTaskFn, RnvTask } from '@rnv/core';
import { TASK_WORKSPACE_UPDATE } from './constants';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';

export const taskRnvWorkspaceUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    // TODO: taskRnvWorkspaceUpdate
    logTask('taskRnvWorkspaceUpdate');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_UPDATE, originTask);

    return true;
};

const Task: RnvTask = {
    description: 'TODO: unused task',
    fn: taskRnvWorkspaceUpdate,
    task: TASK_WORKSPACE_UPDATE,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPrivate: true,
};

export default Task;
