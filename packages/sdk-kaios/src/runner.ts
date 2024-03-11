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
    getContext,
} from '@rnv/core';
import { launchKaiOSSimulator } from './deviceManager';

import { getAppAuthor, getAppDescription, getAppTitle } from '@rnv/sdk-utils';

export const configureKaiOSProject = async () => {
    const c = getContext();
    logDefault('configureKaiOSProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir()}`;

    if (!isPlatformActive(platform)) return;

    await copyAssetsFolder();
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder(platform);
};

const _configureProject = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logDefault('configureProject');
        const { platform } = c;

        if (!isPlatformActive(platform, resolve)) return;

        const appFolder = getPlatformProjectDir();

        const manifestFilePath = path.join(appFolder!, 'manifest.webapp');
        const manifestFile = JSON.parse(fsReadFileSync(manifestFilePath).toString());

        manifestFile.name = `${getAppTitle(c, platform)}`;
        manifestFile.description = `${getAppDescription(c, platform)}`;
        manifestFile.developer = getAppAuthor(c, platform);

        fsWriteFileSync(manifestFilePath, JSON.stringify(manifestFile, null, 2));

        resolve();
    });

export const runKaiOSProject = async () => {
    logDefault('runKaiOSProject');

    await buildCoreWebpackProject();
    await launchKaiOSSimulator(true);
    return true;
};

export const buildKaiOSProject = async () => {
    logDefault('buildKaiOSProject');

    await buildCoreWebpackProject();
    return true;
};
