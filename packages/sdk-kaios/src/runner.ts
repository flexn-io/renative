import { buildCoreWebpackProject, configureCoreWebProject } from '@rnv/sdk-webpack';
import path from 'path';
import {
    RnvContext,
    getPlatformProjectDir,
    fsWriteFileSync,
    fsReadFileSync,
    logDefault,
    isPlatformActive,
    copyBuildsFolder,
    copyAssetsFolder,
} from '@rnv/core';
import { launchKaiOSSimulator } from './deviceManager';

import { getAppAuthor, getAppDescription, getAppTitle } from '@rnv/sdk-utils';

export const configureKaiOSProject = async (c: RnvContext) => {
    logDefault('configureKaiOSProject');

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
        logDefault('configureProject');
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
    logDefault('runKaiOSProject');

    await buildCoreWebpackProject(c);
    await launchKaiOSSimulator(c, true);
    return true;
};

export const buildKaiOSProject = async (c: RnvContext) => {
    logDefault('buildKaiOSProject');

    await buildCoreWebpackProject(c);
    return true;
};
