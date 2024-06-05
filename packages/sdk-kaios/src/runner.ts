import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
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
    getConfigProp,
    chalk,
    logError,
    logInfo,
    RnvContext,
    logSuccess,
    getAppFolder,
} from '@rnv/core';
import { launchKaiOSSimulator } from './deviceManager';

import {
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
    checkPortInUse,
    confirmActiveBundler,
    getAppAuthor,
    getAppDescription,
    getAppTitle,
    waitForHost,
} from '@rnv/sdk-utils';

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
        const manifestFilePath = path.join(appFolder!, 'public/manifest.webapp');
        const manifestFile = JSON.parse(fsReadFileSync(manifestFilePath).toString());

        manifestFile.name = `${getAppTitle()}`;
        manifestFile.description = `${getAppDescription()}`;
        manifestFile.developer = getAppAuthor();

        fsWriteFileSync(manifestFilePath, JSON.stringify(manifestFile, null, 2));

        const manifestFilePath0 = path.join(appFolder!, 'public/manifest.webmanifest');
        const manifestFile0 = JSON.parse(fsReadFileSync(manifestFilePath0).toString());

        manifestFile0.name = getAppTitle();
        manifestFile0.description = getAppDescription();
        manifestFile0.developer = getAppAuthor();

        fsWriteFileSync(manifestFilePath0, JSON.stringify(manifestFile0, null, 2));

        resolve();
    });

export const runKaiOSProject = async (c: RnvContext) => {
    logDefault('runKaiOSProject');
    const { platform } = c;
    const { hosted } = c.program.opts();

    if (!platform) return;

    const bundleAssets = getConfigProp('bundleAssets') === true;
    const isHosted = hosted && !bundleAssets;

    if (isHosted) {
        const isPortActive = await checkPortInUse(c.runtime.port);
        if (isPortActive) {
            const resetCompleted = await confirmActiveBundler();
            c.runtime.skipActiveServerCheck = !resetCompleted;
        }
        logDefault('runKaios', `hosted:${!!isHosted}`);
        return true;
    }

    if (bundleAssets) {
        await buildCoreWebpackProject();
        await launchKaiOSSimulator(true);
    } else {
        const isPortActive = await checkPortInUse(c.runtime.port);
        const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

        if (!isPortActive) {
            logInfo(
                `Your ${chalk().bold(platform)} devServer at port ${chalk().bold(
                    c.runtime.port
                )} is not running. Starting it up for you...`
            );
            waitForHost('')
                .then(() => launchKaiOSSimulator(true))
                .catch(logError);
            await runWebpackServer(isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler();

            if (resetCompleted) {
                waitForHost('')
                    .then(() => launchKaiOSSimulator(true))
                    .catch(logError);
                await runWebpackServer(isWeinreEnabled);
            } else {
                await launchKaiOSSimulator(true);
            }
        }
    }
};

export const buildKaiOSProject = async () => {
    logDefault('buildKaiOSProject');

    const appFolder = getAppFolder();
    await buildCoreWebpackProject();
    logSuccess(`Your build is located in  ${chalk().cyan(path.join(appFolder, `build`))} .`);
    return true;
};
