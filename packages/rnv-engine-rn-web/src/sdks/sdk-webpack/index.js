
import { WebpackUtils, Common, Logger, Constants, PlatformManager, ProjectManager } from 'rnv';

const { getPlatformProjectDir, getConfigProp } = Common;
const { isPlatformActive } = PlatformManager;
const { logTask } = Logger;
const { copyBuildsFolder, copyAssetsFolder } = ProjectManager;
const { RNV_PROJECT_DIR_NAME, RNV_SERVER_DIR_NAME } = Constants;

const { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } = WebpackUtils;

export const buildWeb = async c => buildCoreWebpackProject(c);

export const configureWebProject = async (c) => {
    logTask('configureWebProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir(c);

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    await configureCoreWebProject(c, bundleAssets ? RNV_PROJECT_DIR_NAME : RNV_SERVER_DIR_NAME);

    return copyBuildsFolder(c, platform);
};

// CHROMECAST

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

export const deployWeb = () => {
    logTask('deployWeb');
    // const { platform } = c;

    // DEPRECATED: custom deployers moved to external packages
    // return selectWebToolAndDeploy(c, platform);

    return true;
};

export const exportWeb = () => {
    logTask('exportWeb');
    // const { platform } = c;

    // DEPRECATED: custom deployers moved to external packages
    // return selectWebToolAndExport(c, platform);
    return true;
};
