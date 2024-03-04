import { logTask, executeTask, PARAMS, RnvTaskFn, RnvTask, TaskKey } from '@rnv/core';

const taskWorkspaceUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    // TODO: taskWorkspaceUpdate
    logTask('taskWorkspaceUpdate');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.workspaceUpdate, originTask);

    return true;
};

const Task: RnvTask = {
    description: 'TODO: unused task',
    fn: taskWorkspaceUpdate,
    task: TaskKey.workspaceUpdate,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPrivate: true,
};

export default Task;
