/* eslint-disable import/no-cycle */
import { runWeb, configureCoreWebProject } from '../web';
import { logTask } from '../../systemTools/logger';
import { copyBuildsFolder, copyAssetsFolder } from '../../projectTools/projectParser';
import { getAppFolder } from '../../common';

export const configureChromecastProject = async (c) => {
    logTask(`configureChromecastProject:${c.platform}`);

    c.runtime.platformBuildsProjectPath = `${getAppFolder(c, c.platform)}/public`;

    await copyAssetsFolder(c, c.platform);
    await configureCoreWebProject(c, c.platform);
    await configureProject(c, c.platform);
    return copyBuildsFolder(c, c.platform);
};

export const configureProject = async (c) => {
    logTask(`configureProject:${c.platform}`);
};

export const runChromecast = async (c) => {
    logTask(`runChromecast:${c.platform}`);
    await runWeb(c);
};
