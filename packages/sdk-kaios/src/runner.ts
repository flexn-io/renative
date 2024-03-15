import { buildCoreWebpackProject, configureCoreWebProject } from '@rnv/sdk-webpack';
import path from 'path';
import {
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

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir()}`;

    if (!isPlatformActive()) return;

    await copyAssetsFolder();
    await configureCoreWebProject();
    await _configureProject();
    return copyBuildsFolder();
};

const _configureProject = () =>
    new Promise<void>((resolve) => {
        logDefault('configureProject');
        if (!isPlatformActive(resolve)) return;

        const appFolder = getPlatformProjectDir();

        const manifestFilePath = path.join(appFolder!, 'manifest.webapp');
        const manifestFile = JSON.parse(fsReadFileSync(manifestFilePath).toString());

        manifestFile.name = `${getAppTitle()}`;
        manifestFile.description = `${getAppDescription()}`;
        manifestFile.developer = getAppAuthor();

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
