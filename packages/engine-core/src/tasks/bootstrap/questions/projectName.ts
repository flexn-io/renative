import { getContext, inquirerPrompt } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue } from '../questionHelpers';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { projectName } = c.program.opts();
    const { inputs } = data;
    if (checkInputValue(projectName)) {
        inputs.projectName = projectName;
    } else {
        const inputProjectNameObj = await inquirerPrompt({
            name: 'inputProjectName',
            type: 'input',
            default: 'hello-renative',
            validate: (value) => checkInputValue(value),
            message: "What's your project Name? (folder will be created)",
        });
        inputs.projectName = inputProjectNameObj?.inputProjectName;
    }
};

export default Question;
