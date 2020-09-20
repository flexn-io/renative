// import path from 'path';
// import fs from 'fs';
import { Logger } from 'rnv';

import simpleGit from 'simple-git';

export const gitCommitAndTagVersion = async (c) => {
    const version = c.files.project?.package?.version;
    Logger.logHook(`gitCommitAndTagVersion v${version}`);
    const git = simpleGit({ baseDir: c.paths.project.dir });
    await git.add(`${c.paths.project.dir}/*`);
    await git.commit(version);
    await git.addTag(version);
    return true;
};

export const gitPush = () => {
    // console.log('gitCommitVersion');
    // git push origin HEAD
};
