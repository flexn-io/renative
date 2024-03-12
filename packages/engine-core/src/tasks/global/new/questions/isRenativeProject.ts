import { fsExistsSync, getContext, inquirerPrompt, logWarning } from '@rnv/core';

export const inquiryIsRenativeProject = async () => {
    const c = getContext();
    if (fsExistsSync(c.paths.project.config)) {
        logWarning(`You are in ReNative project. Found: ${c.paths.project.config}`);
        const { confirmInRnvProject } = await inquirerPrompt({
            name: 'confirmInRnvProject',
            type: 'confirm',
            message: 'Are you sure you want to continue?',
        });
        if (!confirmInRnvProject) {
            return Promise.reject('Cancelled');
        }
    }
};
