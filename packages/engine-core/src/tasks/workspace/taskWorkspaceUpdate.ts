import { logTask, executeTask, RnvTaskOptionPresets, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';

const taskWorkspaceUpdate: RnvTaskFn = async (_c, _parentTask, originTask) => {
    // TODO: taskWorkspaceUpdate
    logTask('taskWorkspaceUpdate');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.workspaceUpdate, originTask);

    return true;
};

const Task: RnvTask = {
    description: 'TODO: unused task',
    fn: taskWorkspaceUpdate,
    task: RnvTaskName.workspaceUpdate,
    options: RnvTaskOptionPresets.withBase(),
    isGlobalScope: true,
    isPrivate: true,
};

export default Task;
