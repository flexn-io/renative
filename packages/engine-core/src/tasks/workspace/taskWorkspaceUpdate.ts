import { logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';

const fn: RnvTaskFn = async (_c, _parentTask, originTask) => {
    // TODO: taskWorkspaceUpdate
    logTask('taskWorkspaceUpdate');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.workspaceUpdate, originTask);

    return true;
};

const Task: RnvTask = {
    description: 'TODO: unused task',
    fn,
    task: RnvTaskName.workspaceUpdate,
    isGlobalScope: true,
    isPrivate: true,
};

export default Task;
