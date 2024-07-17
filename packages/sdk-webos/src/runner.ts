import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
import path from 'path';
import {
    execCLI,
    RnvContext,
    getPlatformProjectDir,
    getConfigProp,
    chalk,
    logDefault,
    logError,
    logSuccess,
    logInfo,
    isPlatformActive,
    writeCleanFile,
    copyAssetsFolder,
    copyBuildsFolder,
    copyFileSync,
    DEFAULTS,
    OverridesOptions,
    getAppFolder,
    getContext,
} from '@rnv/core';
import semver from 'semver';
import { runWebosSimOrDevice } from './deviceManager';
import { CLI_WEBOS_ARES_PACKAGE } from './constants';
import {
    checkPortInUse,
    waitForHost,
    getAppVersion,
    confirmActiveBundler,
    getAppId,
    getAppTitle,
    getAppDescription,
    addSystemInjects,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
} from '@rnv/sdk-utils';
import { fsExistsSync } from '@rnv/core';

export const runWebOS = async (c: RnvContext) => {
    const { hosted } = c.program.opts();
    const { target } = c.runtime;
    const { platform } = c;

    if (!platform) return;

    const bundleAssets = getConfigProp('bundleAssets') === true;
    const isHosted = hosted && !bundleAssets;

    if (isHosted) {
        const isPortActive = await checkPortInUse(c.runtime.port);
        if (isPortActive) {
            const resetCompleted = await confirmActiveBundler();
            c.runtime.skipActiveServerCheck = !resetCompleted;
        }
        logDefault('runWebOS', `target:${target} hosted:${!!isHosted}`);
        return;
    }

    const env = getConfigProp('environment');
    if (env !== 'production') {
        process.env.RNV_INJECTED_WEBPACK_SCRIPTS = `${
            process.env.RNV_INJECTED_WEBPACK_SCRIPTS || ''
        }\n<script type="text/javascript" src="webOSTVjs-1.2.8/webOSTV-dev.js"></script>`;
    }

    if (bundleAssets) {
        await buildCoreWebpackProject();

        const appPath = getAppFolder();

        if (!appPath) {
            throw new Error('Failed to resolve appPath');
        }
        // Copying required files to build folder, webpack doesn't have them in the build folder
        const requiredFiles = ['appinfo.json', 'splashBackground.png', 'largeIcon.png', 'icon.png'];

        requiredFiles.map((requiredFile) => {
            const requiredFilePath = path.join(appPath, requiredFile);
            if (fsExistsSync(requiredFilePath)) {
                copyFileSync(requiredFilePath, path.join(appPath, 'build', requiredFile));
            }
        });
        await runWebosSimOrDevice();
    } else {
        const isPortActive = await checkPortInUse(c.runtime.port);
        const isWeinreEnabled = platform
            ? REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted
            : false;

        if (!isPortActive) {
            logInfo(
                `Your ${chalk().bold.white(platform)} devServer at port ${chalk().bold.white(
                    c.runtime.port
                )} is not running. Starting it up for you...`
            );
            waitForHost('')
                .then(() => {
                    runWebosSimOrDevice();
                })
                .catch(logError);
            await runWebpackServer(isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler();
            if (resetCompleted) {
                waitForHost('')
                    .then(() => runWebosSimOrDevice())
                    .catch(logError);
                await runWebpackServer(isWeinreEnabled);
            } else {
                await runWebosSimOrDevice();
            }
        }
    }
};

export const buildWebOSProject = async () => {
    const c = getContext();
    logDefault('buildWebOSProject');

    await buildCoreWebpackProject();

    if (!c.program.opts().hosted) {
        const tDir = path.join(getPlatformProjectDir()!, 'build');
        const tOut = path.join(getAppFolder()!, 'output');

        const appinfoSrc = path.join(getPlatformProjectDir()!, 'appinfo.json');
        const appinfoDest = path.join(tDir, 'appinfo.json');

        copyFileSync(appinfoSrc, appinfoDest);
        copyFileSync(path.join(getPlatformProjectDir()!, 'icon.png'), path.join(tDir, 'icon.png'));
        copyFileSync(path.join(getPlatformProjectDir()!, 'largeIcon.png'), path.join(tDir, 'largeIcon.png'));
        copyFileSync(
            path.join(getPlatformProjectDir()!, 'splashBackground.png'),
            path.join(tDir, 'splashBackground.png')
        );
        await execCLI(CLI_WEBOS_ARES_PACKAGE, `-o "${tOut}" "${tDir}" -n`);

        logSuccess(`Your IPK package is located in ${chalk().cyan(tOut)} .`);
    }
};

export const configureWebOSProject = async () => {
    const c = getContext();
    logDefault('configureWebOSProject');

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir()!;

    if (!isPlatformActive()) return;

    await copyAssetsFolder();
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder();
};

const _configureProject = async (c: RnvContext) => {
    logDefault('_configureProject');

    const configFile = 'appinfo.json';

    const injects: OverridesOptions = [
        {
            pattern: '{{APPLICATION_ID}}',
            override: getAppId()?.toLowerCase(),
        },
        {
            pattern: '{{APP_TITLE}}',
            override: getAppTitle(),
        },
        {
            pattern: '{{APP_VERSION}}',
            override: semver.coerce(getAppVersion())?.format(),
        },
        {
            pattern: '{{APP_DESCRIPTION}}',
            override: getAppDescription(),
        },
        {
            pattern: '{{APP_BG_COLOR}}',
            override: getConfigProp('backgroundColor') || DEFAULTS.backgroundColor,
        },
        {
            pattern: '{{APP_ICON_COLOR}}',
            override: getConfigProp('iconColor') || '#000',
        },
        {
            pattern: '{{APP_VENDOR}}',
            override: getConfigProp('author') || 'Unspecified',
        },
    ];

    addSystemInjects(injects);

    const file = path.join(getPlatformProjectDir()!, configFile);

    writeCleanFile(file, file, injects, undefined, c);

    return true;
};
