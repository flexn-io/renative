import { getWorkspaceOptions, inquirerPrompt } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue } from '../questionHelpers';
import { getContext } from '../../../getContext';

const Question = async (data: NewProjectData) => {
    const c = getContext();
    const { ci, workspace } = c.program.opts();
    if (checkInputValue(workspace)) {
        data.inputs.workspaceID = workspace;
    } else if (ci) {
        data.inputs.workspaceID = data.defaults.workspaceID;
    } else {
        const answer = await inquirerPrompt({
            name: 'inputWorkspace',
            type: 'list',
            message: 'What workspace to use?',
            default: data.defaults.workspaceID,
            choices: getWorkspaceOptions().keysAsArray,
        });

        data.inputs.workspaceID = answer?.inputWorkspace;
    }

    c.runtime.selectedWorkspace = data.inputs.workspaceID;
    data.files.project.renativeConfig.workspaceID = data.inputs.workspaceID;
};

export default Question;
