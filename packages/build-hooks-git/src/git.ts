import { RnvContext, logError, logHook } from '@rnv/core';
import path from 'path';
import simpleGit from 'simple-git';

export const gitCommit = async (c: RnvContext) => {
    const v = c.files.project?.package?.version;

    if (!v) {
        logError('Version not found in package.json. cannot perform git commit');
        return;
    }

    const baseDir = path.join(c.paths.project.dir);
    logHook(`gitCommitAndTagVersion v${v}`);
    const git = simpleGit({ baseDir });
    logHook('adding files');
    await git.add(`${baseDir}/*`);
    logHook('COMMITING...');
    await git.commit(v);
    logHook('DONE');
};

export const gitTag = async (c: RnvContext) => {
    const v = c.files.project.package.version;

    if (!v) {
        logError('Version not found in package.json. cannot perform git tag');
        return;
    }

    const baseDir = path.join(c.paths.project.dir);
    logHook(`gitTagAndPush v${v}`);
    const git = simpleGit({ baseDir });
    await git.addTag(v);
    return true;
};

export const gitCommitAndTag = async (c: RnvContext) => {
    await gitCommit(c);
    await gitTag(c);
    return true;
};
