import path from 'path';
import { Logger } from 'rnv';
import simpleGit from 'simple-git';

export const gitCommit = async (c: any) => {
    const v = c.files.project?.package?.version;

    const baseDir = path.join(c.paths.project.dir);
    Logger.logHook(`gitCommitAndTagVersion v${v}`);
    const git = simpleGit({ baseDir });
    Logger.logHook('adding files');
    await git.add(`${baseDir}/*`);
    Logger.logHook('COMMITING...');
    await git.commit(v);
    Logger.logHook('DONE');
};

export const gitTag = async (c: any) => {
    const v = c.files.project.package.version;

    const baseDir = path.join(c.paths.project.dir);
    Logger.logHook(`gitTagAndPush v${v}`);
    const git = simpleGit({ baseDir });
    await git.addTag(v);
    return true;
};

export const gitCommitAndTag = async (c: any) => {
    await gitCommit(c);
    await gitTag(c);
    return true;
};
