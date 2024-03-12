import { getContext, inquirerPrompt, updateRenativeConfigs } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue } from '../utils';

export const inquiryWorkspace = async ({ data }: { data: NewProjectData }) => {
    const c = getContext();
    const { ci, workspace } = c.program;
    let inputWorkspace;
    if (checkInputValue(workspace)) {
        inputWorkspace = workspace;
    } else if (ci) {
        inputWorkspace = data.defaultWorkspace;
    } else {
        const answer = await inquirerPrompt({
            name: 'inputWorkspace',
            type: 'list',
            message: 'What workspace to use?',
            default: data.defaultWorkspace,
            choices: data.optionWorkspaces.keysAsArray,
        });

        inputWorkspace = answer?.inputWorkspace;
    }
    data.optionWorkspaces.selectedOption = inputWorkspace;
    c.runtime.selectedWorkspace = inputWorkspace;

    await updateRenativeConfigs();
};
