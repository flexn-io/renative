import path from 'path';
import { PlatformManager, FileUtils, Common, Logger, ProjectManager, SDKManager } from 'rnv';
import { buildCoreWebpackProject, configureCoreWebProject } from '../sdk-webpack/webpackUtils';

const {
    getPlatformProjectDir,
    getTemplateProjectDir,
    getAppTitle,
    getAppDescription,
    getAppAuthor,
} = Common;
const { fsWriteFileSync, fsReadFileSync } = FileUtils;
const { logTask } = Logger;
const { isPlatformActive } = PlatformManager;
const { copyBuildsFolder, copyAssetsFolder } = ProjectManager;

const { launchKaiOSSimulator } = SDKManager.Kaios;

export const configureKaiOSProject = async (c) => {
    logTask('configureKaiOSProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject(c);
    await _configureProject(c);
    return copyBuildsFolder(c, platform);
};

const _configureProject = c => new Promise((resolve) => {
    logTask('configureProject');
    const { platform } = c;

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getPlatformProjectDir(c);
    const templateFolder = getTemplateProjectDir(c, platform);

    const manifestFilePath = path.join(templateFolder, 'manifest.webapp');
    const manifestFilePath2 = path.join(appFolder, 'manifest.webapp');
    const manifestFile = JSON.parse(fsReadFileSync(manifestFilePath));

    manifestFile.name = `${getAppTitle(c, platform)}`;
    manifestFile.description = `${getAppDescription(c, platform)}`;
    manifestFile.developer = getAppAuthor(c, platform);

    fsWriteFileSync(
        manifestFilePath2,
        JSON.stringify(manifestFile, null, 2)
    );

    resolve();
});

export const runFirefoxProject = async (c) => {
    logTask('runFirefoxProject');
    const { platform } = c;

    await buildCoreWebpackProject(c);
    await launchKaiOSSimulator(c, platform);
    return true;
};

export const buildFirefoxProject = async (c) => {
    logTask('buildFirefoxProject');

    await buildCoreWebpackProject(c);
    return true;
};
