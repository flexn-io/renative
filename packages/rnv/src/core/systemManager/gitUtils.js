import path from 'path';
import { executeAsync, commandExistsSync } from './exec';
import { fsExistsSync } from './fileutils';
import { logTask, logWarning, logInfo } from './logger';

export const configureGit = async (c) => {
    const projectPath = c.paths.project.dir;
    logTask(`configureGit:${projectPath}`);

    if (!fsExistsSync(path.join(projectPath, '.git'))) {
        logInfo('Your project does not have a git repo. Creating one...DONE');
        if (commandExistsSync('git')) {
            await executeAsync('git init', { cwd: projectPath });
            await executeAsync('git add -A', { cwd: projectPath });
            await executeAsync('git commit -m "Initial"', { cwd: projectPath });
        } else {
            logWarning(
                "We tried to create a git repo inside your project but you don't seem to have git installed"
            );
        }
    }
};
