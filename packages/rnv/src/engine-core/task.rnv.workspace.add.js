/* eslint-disable import/no-cycle */

import path from 'path';
import { inquirerPrompt } from '../cli/prompt';
import {
    logTask,
} from '../core/systemManager/logger';
import { createWorkspace } from '../core/projectManager/workspace';
import { fsExistsSync } from '../core/systemManager/fileutils';

export const taskRnvWorkspaceAdd = async (c, parentTask, originTask) => {
    logTask('taskRnvWorkspaceAdd', `parent:${parentTask} origin:${originTask}`);

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
    description: '',
    fn: taskRnvWorkspaceAdd,
    task: 'workspace add',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
