import path from 'path';
import {
    inquirerPrompt,
    logTask,
    createWorkspace,
    fsExistsSync,
    executeTask,
    TASK_WORKSPACE_ADD,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    RnvTask,
} from '@rnv/core';

export const taskRnvWorkspaceAdd: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvWorkspaceAdd');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_ADD, originTask);

    const { workspace } = await inquirerPrompt({
        name: 'workspace',
        type: 'input',
        message: 'absolute path to new workspace',
        validate: (i: string) => !!i || 'No path provided',
    });

    const workspacePath = path.join(workspace);

    if (fsExistsSync(workspacePath)) {
        const { confirm } = await inquirerPrompt({
            name: 'confirm',
            type: 'confirm',
            message: `Folder ${workspacePath} already exists are you sure you want to override it?`,
        });
        if (!confirm) return false;
    }

    let workspaceID = workspacePath.split('/').pop()?.replace(/@|\./g, '') || 'rnv';

    const { workspaceIDInput } = await inquirerPrompt({
        name: 'workspaceIDInput',
        type: 'input',
        message: `ID of the workspace (${workspaceID})`,
    });

    workspaceID = workspaceIDInput || workspaceID;
    createWorkspace(c, workspaceID, workspacePath);

    return true;
};

const Task: RnvTask = {
    description: 'Add new workspace',
    fn: taskRnvWorkspaceAdd,
    task: TASK_WORKSPACE_ADD,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
