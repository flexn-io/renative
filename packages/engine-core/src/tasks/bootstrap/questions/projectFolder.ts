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

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();

    const { inputs, files } = data;

    inputs.projectFolderName = inputs.projectName?.replace?.(/(\s+)/g, '_');
    inputs.packageName = inputs.projectName?.replace(/\s+/g, '-').toLowerCase();
    c.paths.project.dir = path.join(c.paths.user.currentDir, inputs.projectFolderName || '');
    c.paths.project.package = path.join(c.paths.project.dir, RnvFileName.package);
    c.paths.project.config = path.join(c.paths.project.dir, RnvFileName.rnv);

    files.project.renativeConfig.project.projectName = inputs.projectName;
    files.project.packageJson.name = inputs.packageName;

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
