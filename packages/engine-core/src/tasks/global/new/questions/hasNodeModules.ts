import { fsExistsSync, getContext, inquirerPrompt, logWarning, removeDirs } from '@rnv/core';
import { NewProjectData } from '../types';

export const inquiryHasNodeModules = async (data: NewProjectData) => {
    const c = getContext();
    if (fsExistsSync(c.paths.project.nodeModulesDir)) {
        logWarning(
            `Found node_modules directory at your location. If you continue it will be deleted: ${c.paths.project.nodeModulesDir}`
        );
        const { confirmDeleteNodeModules } = await inquirerPrompt({
            name: 'confirmDeleteNodeModules',
            type: 'confirm',
            message: 'Are you sure you want to continue?',
        });
        data.confirmDeleteNodeModules = confirmDeleteNodeModules;
        if (confirmDeleteNodeModules) {
            await removeDirs([c.paths.project.nodeModulesDir]);
        }
    }
};
