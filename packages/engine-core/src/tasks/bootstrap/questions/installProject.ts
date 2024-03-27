import { executeAsync, getContext, inquirerPrompt, isYarnInstalled } from '@rnv/core';
import type { NewProjectData } from '../types';

const Question = async (data: NewProjectData) => {
    const { inputs } = data;
    const c = getContext();

    const { confirmInstallProject } = await inquirerPrompt({
        name: 'confirmInstallProject',
        type: 'confirm',
        message: 'Project is ready. Do you want to install all dependencies now?',
    });
    inputs.confirmProjectInstall = confirmInstallProject;

    if (confirmInstallProject) {
        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm install'}`, {
            cwd: c.paths.project.dir,
        });
    }
};

export default Question;
