import { ConfigName, cleanFolder, fsExistsSync, getContext, inquirerPrompt, logWarning, mkdirSync } from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';
import { checkInputValue } from '../utils';

export const inquiryProjectName = async (data: NewProjectData) => {
    const c = getContext();
    const { projectName } = c.program;
    if (checkInputValue(projectName)) {
        data.inputProjectName = projectName;
    } else {
        const inputProjectNameObj = await inquirerPrompt({
            name: 'inputProjectName',
            type: 'input',
            default: 'hello-renative',
            validate: (value) => checkInputValue(value),
            message: "What's your project Name? (folder will be created)",
        });
        data.inputProjectName = inputProjectNameObj?.inputProjectName;
    }

    data.projectName = data.inputProjectName?.replace?.(/(\s+)/g, '_');
    data.packageName = data.inputProjectName?.replace(/\s+/g, '-').toLowerCase();
    c.paths.project.dir = path.join(c.paths.user.currentDir, data.projectName || '');
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.config = path.join(c.paths.project.dir, ConfigName.renative);

    data.files.project.renativeConfig.projectName = data.projectName;
    data.files.project.packageJson.name = data.packageName;

    if (fsExistsSync(c.paths.project.dir)) {
        logWarning(`Folder ${c.paths.project.dir} already exists. RNV will override it.`);
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Continue?',
        });

        if (!confirm) {
            return Promise.reject('Cancelled by user');
        }
        await cleanFolder(c.paths.project.dir);
    }

    mkdirSync(c.paths.project.dir);
};
