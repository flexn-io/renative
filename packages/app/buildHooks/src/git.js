import path from 'path';
// import fs from 'fs';
import { Logger } from 'rnv';

import simpleGit from 'simple-git';

export const gitCommitAndTagVersion = async (c) => {
    const version = c.files.project?.package?.version;
    const baseDir = path.join(c.paths.project.dir, '../..');
    Logger.logHook(`gitCommitAndTagVersion v${version}`);
    const git = simpleGit({ baseDir });
    await git.add(`${baseDir}/*`);
    await git.commit(version);
    await git.addTag(version);
    return true;
};

export const gitPush = () => {
    // console.log('gitCommitVersion');
    // git push origin HEAD
};
