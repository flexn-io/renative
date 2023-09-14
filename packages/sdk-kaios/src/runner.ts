import { buildCoreWebpackProject, configureCoreWebProject } from '@rnv/sdk-webpack';
import path from 'path';
import { Common, FileUtils, Logger, PlatformManager, ProjectManager, RnvContext } from 'rnv';
import { launchKaiOSSimulator } from './deviceManager';

const { getPlatformProjectDir, getAppTitle, getAppDescription, getAppAuthor } = Common;
const { fsWriteFileSync, fsReadFileSync } = FileUtils;
const { logTask } = Logger;
const { isPlatformActive } = PlatformManager;
const { copyBuildsFolder, copyAssetsFolder } = ProjectManager;

export const configureKaiOSProject = async (c: RnvContext) => {
    logTask('configureKaiOSProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder(c, platform);
};

const _configureProject = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logTask('configureProject');
        const { platform } = c;

        if (!isPlatformActive(c, platform, resolve)) return;

        const appFolder = getPlatformProjectDir(c);

        const manifestFilePath = path.join(appFolder!, 'manifest.webapp');
        const manifestFile = JSON.parse(fsReadFileSync(manifestFilePath).toString());

        manifestFile.name = `${getAppTitle(c, platform)}`;
        manifestFile.description = `${getAppDescription(c, platform)}`;
        manifestFile.developer = getAppAuthor(c, platform);

        fsWriteFileSync(manifestFilePath, JSON.stringify(manifestFile, null, 2));

        resolve();
    });

export const runKaiOSProject = async (c: RnvContext) => {
    logTask('runKaiOSProject');

    await buildCoreWebpackProject(c);
    await launchKaiOSSimulator(c);
    return true;
};

export const buildKaiOSProject = async (c: RnvContext) => {
    logTask('buildKaiOSProject');

    await buildCoreWebpackProject(c);
    return true;
};
