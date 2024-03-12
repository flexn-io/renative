import { cleanFolder, fsExistsSync, getContext, inquirerPrompt, mkdirSync } from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';
import { checkInputValue } from '../utils';

export const inquiryProjectName = async ({ data }: { data: NewProjectData }) => {
    let inputProjectName: string;

    const c = getContext();
    const { projectName } = c.program;
    if (checkInputValue(projectName)) {
        inputProjectName = projectName;
    } else {
        const inputProjectNameObj = await inquirerPrompt({
            name: 'inputProjectName',
            type: 'input',
            validate: (value) => checkInputValue(value),
            message: "What's your project Name? (no spaces, folder based on ID will be created in this directory)",
        });
        inputProjectName = inputProjectNameObj?.inputProjectName;
    }

    data.projectName = inputProjectName.replace(/(\s+)/g, '_');
    c.paths.project.dir = path.join(c.paths.CURRENT_DIR, data.projectName);

    if (fsExistsSync(c.paths.project.dir)) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            name: 'confirm',
            message: `Folder ${c.paths.project.dir} already exists. RNV will override it. Continue?`,
        });

        if (!confirm) {
            return Promise.reject('Cancelled by user');
        }
        await cleanFolder(c.paths.project.dir);
    }

    mkdirSync(c.paths.project.dir);
};
