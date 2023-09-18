import path from 'path';
import { RnvContext } from '../context/types';
import { executeAsync, commandExistsSync } from '../system/exec';
import { fsExistsSync } from '../system/fs';
import { logTask, logWarning, logInfo } from '../logger';

export const configureGit = async (c: RnvContext) => {
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
