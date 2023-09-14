import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
import path from 'path';
import {
    execCLI,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
    RnvContext,
    getPlatformProjectDir,
    getAppVersion,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler,
    addSystemInjects,
    waitForHost,
    chalk,
    logTask,
    logError,
    logSuccess,
    logInfo,
    isPlatformActive,
    writeCleanFile,
    copyAssetsFolder,
    copyBuildsFolder,
    getPlatformBuildDir,
    CLI_WEBOS_ARES_PACKAGE,
    getAppId,
    getAppTitle,
    getAppDescription,
} from 'rnv';
import semver from 'semver';
import { runWebosSimOrDevice } from './deviceManager';

export const runWebOS = async (c: RnvContext) => {
    const { hosted } = c.program;
    const { target } = c.runtime;
    const { platform } = c;

    const isHosted = hosted && !getConfigProp(c, platform, 'bundleAssets');

    if (isHosted) {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        if (isPortActive) {
            const resetCompleted = await confirmActiveBundler(c);
            c.runtime.skipActiveServerCheck = !resetCompleted;
        }
    }

    logTask('runWebOS', `target:${target} hosted:${!!isHosted}`);
    if (isHosted) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    const env = getConfigProp(c, platform, 'environment');
    if (env !== 'production') {
        process.env.RNV_INJECTED_WEBPACK_SCRIPTS = `${
            process.env.RNV_INJECTED_WEBPACK_SCRIPTS || ''
        }\n<script type="text/javascript" src="webOSTVjs-1.1.1/webOSTV-dev.js"></script>`;
    }

    if (bundleAssets) {
        await buildCoreWebpackProject(c);
        await runWebosSimOrDevice(c);
    } else {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

        if (!isPortActive) {
            logInfo(
                `Your ${chalk().white(platform)} devServer at port ${chalk().white(
                    c.runtime.port
                )} is not running. Starting it up for you...`
            );
            waitForHost(c, '')
                .then(() => {
                    runWebosSimOrDevice(c);
                })
                .catch(logError);
            await runWebpackServer(c, isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler(c);
            if (resetCompleted) {
                waitForHost(c, '')
                    .then(() => runWebosSimOrDevice(c))
                    .catch(logError);
                await runWebpackServer(c, isWeinreEnabled);
            } else {
                await runWebosSimOrDevice(c);
            }
        }
    }
};

export const buildWebOSProject = async (c: RnvContext) => {
    logTask('buildWebOSProject');

    await buildCoreWebpackProject(c);

    if (!c.program.hosted) {
        const tDir = getPlatformProjectDir(c);
        const tOut = path.join(getPlatformBuildDir(c)!, 'output');
        await execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir} -n`);

        logSuccess(`Your IPK package is located in ${chalk().cyan(tOut)} .`);
    }
};

export const configureWebOSProject = async (c: RnvContext) => {
    logTask('configureWebOSProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir(c)!;

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder(c, platform);
};

const _configureProject = async (c: RnvContext) => {
    logTask('_configureProject');
    const { platform } = c;

    const configFile = 'appinfo.json';

    const injects = [
        {
            pattern: '{{APPLICATION_ID}}',
            override: getAppId(c, platform).toLowerCase(),
        },
        {
            pattern: '{{APP_TITLE}}',
            override: getAppTitle(c, platform),
        },
        {
            pattern: '{{APP_VERSION}}',
            override: semver.coerce(getAppVersion(c, platform)),
        },
        {
            pattern: '{{APP_DESCRIPTION}}',
            override: getAppDescription(c, platform),
        },
        {
            pattern: '{{APP_BG_COLOR}}',
            override: getConfigProp(c, platform, 'bgColor', '#fff'),
        },
        {
            pattern: '{{APP_ICON_COLOR}}',
            override: getConfigProp(c, platform, 'iconColor', '#000'),
        },
        {
            pattern: '{{APP_VENDOR}}',
            override: getConfigProp(c, platform, 'vendor', 'Pavel Jacko'),
        },
    ];

    addSystemInjects(c, injects);

    const file = path.join(getPlatformProjectDir(c)!, configFile);

    writeCleanFile(file, file, injects, undefined, c);

    return true;
};
