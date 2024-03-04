import { logTask, executeTask, RnvTaskOptionPresets, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';

const taskWorkspaceUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    // TODO: taskWorkspaceUpdate
    logTask('taskWorkspaceUpdate');

    await executeTask(c, RnvTaskName.projectConfigure, RnvTaskName.workspaceUpdate, originTask);

    return true;
};

const Task: RnvTask = {
    description: 'TODO: unused task',
    fn: taskWorkspaceUpdate,
    task: RnvTaskName.workspaceUpdate,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPrivate: true,
};

export default Task;
