import path from 'path';
// import fs from 'fs';
import { Logger } from 'rnv';

import simpleGit from 'simple-git';

export const gitCommit = async (c) => {
    let version;
    if (c.files.project && c.files.project.package && c.files.project.package.version) {
        // eslint-disable-next-line prefer-destructuring
        version = c.files.project.package.version;
    }
    const baseDir = path.join(c.paths.project.dir, '../..');
    Logger.logHook(`gitCommitAndTagVersion v${version}`);
    const git = simpleGit({ baseDir });
    Logger.logHook('adding files');
    await git.add(`${baseDir}/*`);
    Logger.logHook('COMMITING...');
    await git.commit(version);
    Logger.logHook('DONE');
};

export const gitTag = async (c) => {
    let version;
    if (c.files.project && c.files.project.package && c.files.project.package.version) {
        // eslint-disable-next-line prefer-destructuring
        version = c.files.project.package.version;
    }
    const baseDir = path.join(c.paths.project.dir, '../..');
    Logger.logHook(`gitTagAndPush v${version}`);
    const git = simpleGit({ baseDir });
    await git.addTag(version);
    return true;
};
