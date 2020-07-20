/* eslint-disable import/no-cycle */

import path from 'path';
import { inquirerPrompt } from '../../cli/prompt';
import {
    logTask,
} from '../systemManager/logger';
import { createWorkspace } from '../projectManager/workspace';
import { fsExistsSync } from '../systemManager/fileutils';

export const rnvWorkspaceAdd = async (c) => {
    logTask('rnvWorkspaceAdd');

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
