import {
    commandExistsSync,
    executeAsync,
    fsExistsSync,
    getContext,
    inquirerPrompt,
    logInfo,
    logTask,
    logWarning,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

export const inquiryGit = async ({ data }: { data: NewProjectData }) => {
    const c = getContext();
    const { gitEnabled, ci } = c.program;
    data.gitEnabled = gitEnabled === 'true' || gitEnabled === true;

    if (gitEnabled === undefined && !ci) {
        const response = await inquirerPrompt({
            name: 'gitEnabled',
            type: 'confirm',
            message: 'Do you want to set-up git in your new project?',
        });

        data.gitEnabled = response.gitEnabled;
    }
};

export const configureGit = async () => {
    const c = getContext();
    const projectPath = c.paths.project.dir;
    logTask(`configureGit:${projectPath}`);

    if (!fsExistsSync(path.join(projectPath, '.git'))) {
        logInfo('Your project does not have a git repo. Creating one...DONE');
        if (commandExistsSync('git')) {
            await executeAsync('git init', { cwd: projectPath });
            await executeAsync('git add -A', { cwd: projectPath });
            await executeAsync('git commit -m "Initial"', { cwd: projectPath });
        } else {
            logWarning("We tried to create a git repo inside your project but you don't seem to have git installed");
        }
    }
};
