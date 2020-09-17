import { runWebpackServer, configureCoreWebProject } from './index';
import { logTask } from '../core/systemManager/logger';
import { copyBuildsFolder, copyAssetsFolder } from '../core/projectManager/projectParser';
import { getPlatformProjectDir, getConfigProp } from '../core/common';
import { RNV_PROJECT_DIR_NAME, RNV_SERVER_DIR_NAME } from '../core/constants';

export const configureChromecastProject = async (c) => {
    logTask(`configureChromecastProject:${c.platform}`);

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');

    await copyAssetsFolder(c, c.platform);
    await configureCoreWebProject(c, bundleAssets ? RNV_PROJECT_DIR_NAME : RNV_SERVER_DIR_NAME);
    await configureProject(c);
    return copyBuildsFolder(c, c.platform);
};

export const configureProject = async (c) => {
    logTask(`configureProject:${c.platform}`);
};

export const runChromecast = async (c) => {
    logTask(`runChromecast:${c.platform}`);
    await runWebpackServer(c);
};
