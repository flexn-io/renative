import {
    RnvFileName,
    cleanFolder,
    fsExistsSync,
    getContext,
    inquirerPrompt,
    logInfo,
    logWarning,
    mkdirSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';
import { checkInputValue } from '../utils';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { projectName } = c.program;
    let plainProjectName: string | undefined;
    if (checkInputValue(projectName)) {
        plainProjectName = projectName;
    } else {
        const inputProjectNameObj = await inquirerPrompt({
            name: 'inputProjectName',
            type: 'input',
            default: 'hello-renative',
            validate: (value) => checkInputValue(value),
            message: "What's your project Name? (folder will be created)",
        });
        plainProjectName = inputProjectNameObj?.inputProjectName;
    }

    data.inputs.projectName = plainProjectName?.replace?.(/(\s+)/g, '_');
    data.inputs.packageName = plainProjectName?.replace(/\s+/g, '-').toLowerCase();
    c.paths.project.dir = path.join(c.paths.user.currentDir, data.inputs.projectName || '');
    c.paths.project.package = path.join(c.paths.project.dir, RnvFileName.package);
    c.paths.project.config = path.join(c.paths.project.dir, RnvFileName.renative);

    data.files.project.renativeConfig.projectName = data.inputs.projectName;
    data.files.project.packageJson.name = data.inputs.packageName;

    if (fsExistsSync(c.paths.project.dir)) {
        logWarning(`Folder ${c.paths.project.dir} already exists. RNV will override it.`);
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Continue?',
        });

        if (!confirm) {
            return Promise.reject('Cancelled by user');
        } else {
            logInfo('Cleaning up existing folder...');
        }
        await cleanFolder(c.paths.project.dir);
    }

    mkdirSync(c.paths.project.dir);
};

export default Question;
