import path from 'path';
import { inquirerPrompt, createWorkspace, fsExistsSync, createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Add new workspace',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
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
        createWorkspace(workspaceID, workspacePath);

        return true;
    },
    task: RnvTaskName.workspaceAdd,
    isGlobalScope: true,
});
