import { fsExistsSync, getContext, inquirerPrompt, logWarning } from '@rnv/core';
import { NewProjectData } from '../types';

const Question = async (data: NewProjectData) => {
    const c = getContext();
    if (fsExistsSync(c.paths.project.config)) {
        logWarning(`You are in ReNative project. Found: ${c.paths.project.config}`);
        const { confirmInRnvProject } = await inquirerPrompt({
            name: 'confirmInRnvProject',
            type: 'confirm',
            message: 'Are you sure you want to continue?',
        });
        data.inputs.confirmInRnvProject = confirmInRnvProject;
        if (!confirmInRnvProject) {
            return Promise.reject('Cancelled');
        }
    }
};

export default Question;
