import path from 'path';
import { inquirerPrompt } from '../../cli/prompt';
import { logTask } from '../../core/systemManager/logger';
import { createWorkspace } from '../../core/projectManager/workspace';
import { fsExistsSync } from '../../core/systemManager/fileutils';
import { executeTask } from '../../core/engineManager';
import { TASK_WORKSPACE_ADD, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';

export const taskRnvWorkspaceAdd = async (c, parentTask, originTask) => {
    logTask('taskRnvWorkspaceAdd');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_ADD, originTask);

    const { workspace } = await inquirerPrompt({
        name: 'workspace',
        type: 'input',
        message: 'absolute path to new workspace',
        validate: i => !!i || 'No path provided'
    });

    const workspacePath = path.join(workspace);

    if (fsExistsSync(workspacePath)) {
        const { confirm } = await inquirerPrompt({
            name: 'confirm',
            type: 'confirm',
            message: `Folder ${workspacePath} already exists are you sure you want to override it?`
        });
        if (!confirm) return;
    }

    let workspaceID = workspacePath
        .split('/')
        .pop()
        .replace(/@|\./g, '');

    const { workspaceIDInput } = await inquirerPrompt({
        name: 'workspaceIDInput',
        type: 'input',
        message: `ID of the workspace (${workspaceID})`
    });

    workspaceID = workspaceIDInput || workspaceID;
    createWorkspace(c, workspaceID, workspacePath);
};

export default {
    description: 'Add new workspace',
    fn: taskRnvWorkspaceAdd,
    task: TASK_WORKSPACE_ADD,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
