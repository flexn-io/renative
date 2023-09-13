import { logTask, executeTask, TASK_WORKSPACE_UPDATE, TASK_PROJECT_CONFIGURE, PARAMS, RnvTaskFn } from 'rnv';

export const taskRnvWorkspaceUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    // TODO: taskRnvWorkspaceUpdate
    logTask('taskRnvWorkspaceUpdate');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_UPDATE, originTask);

    return true;
};

export default {
    description: '',
    fn: taskRnvWorkspaceUpdate,
    task: TASK_WORKSPACE_UPDATE,
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
    isGlobalScope: true,
};
