import { logTask, executeTask, PARAMS, RnvTaskFn, RnvTask, TaskKey } from '@rnv/core';

export const taskRnvWorkspaceUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    // TODO: taskRnvWorkspaceUpdate
    logTask('taskRnvWorkspaceUpdate');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.workspaceUpdate, originTask);

    return true;
};

const Task: RnvTask = {
    description: 'TODO: unused task',
    fn: taskRnvWorkspaceUpdate,
    task: TaskKey.workspaceUpdate,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPrivate: true,
};

export default Task;
