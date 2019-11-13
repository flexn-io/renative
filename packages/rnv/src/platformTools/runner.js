/* eslint-disable import/no-cycle */
// @todo fix circular
import chalk from 'chalk';
import open from 'react-dev-utils/openBrowser';
import ip from 'ip';
import path from 'path';

import {
    isPlatformSupported,
    isBuildSchemeSupported,
    logTask,
    logError,
    checkSdk,
    logErrorPlatform,
    configureIfRequired,
    cleanPlatformIfRequired,
    logDebug,
    writeCleanFile,
    getConfigProp,
    waitForWebpack,
    getSourceExts
} from '../common';
import {
    IOS,
    TVOS,
    ANDROID,
    WEB,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    MACOS,
    WINDOWS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    WEB_HOSTED_PLATFORMS,
    PLATFORMS
} from '../constants';
import {
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    runAppleLog
} from './apple';
import { buildWeb, runWeb, deployWeb, exportWeb } from './web';
import { runTizen, buildTizenProject } from './tizen';
import { runWebOS, buildWebOSProject } from './webos';
import { runFirefoxProject, buildFirefoxProject } from './firefox';
import {
    runElectron,
    buildElectron, runElectronDevServer, configureElectronProject, exportElectron
} from './electron';
import PlatformSetup from '../setupTools';
import {
    packageAndroid,
    runAndroid,
    configureGradleProject,
    buildAndroid,
    runAndroidLog
} from './android';
import { copyFolderContentsRecursiveSync } from '../systemTools/fileutils';
import { executeAsync } from '../systemTools/exec';
import { isBundlerRunning, waitForBundler } from './bundler';
import { logInfo } from '../systemTools/logger';

const isRunningOnWindows = process.platform === 'win32';

let keepRNVRunning = false;

// ##########################################
// PUBLIC API
// ##########################################


export const rnvStart = async (c, shouldOpenBrowser) => {
    const { platform } = c;
    const port = c.program.port || c.platformDefaults[platform] ? c.platformDefaults[platform].defaultPort : null;
    const { hosted } = c.program;
    const isWebHostEnabled = _isWebHostEnabled(c, platform);

    logTask(`rnvStart:${platform}:${port}:${hosted}:${isWebHostEnabled}`);

    if (isWebHostEnabled && hosted) {
        const hostIp = isRunningOnWindows ? '127.0.0.1' : '0.0.0.0';
        waitForWebpack(c, port)
            .then(() => open(`http://${hostIp}:${port}/`))
            .catch(logError);
    }

    switch (platform) {
    case MACOS:
    case WINDOWS:
        await configureIfRequired(c, platform);
        return runElectronDevServer(c, platform, port);

    case WEB:
    case TIZEN:
    case WEBOS:
    case TIZEN_MOBILE:
    case TIZEN_WATCH:
        await configureIfRequired(c, platform);
        return runWeb(c, platform, port, shouldOpenBrowser);
    default:
        if (hosted) {
            return logError('This platform does not support hosted mode', true);
        }
    }

    const defaultPort = PLATFORMS[platform]?.defaultPort || 8081;
    let startCmd = `node ./node_modules/react-native/local-cli/cli.js start --sourceExts ${getSourceExts(c).join(',')} --port ${defaultPort} --config=metro.config.js`;
    if (c.program.reset) {
        startCmd += ' --reset-cache';
    }

    await executeAsync(c, startCmd, { stdio: 'inherit', silent: true });
};

const runWeinre = c => executeAsync(c, 'npx weinre --boundHost -all-');

export const rnvDebug = async (c) => {
    logTask(`rnvDebug:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await runWeinre(c);
};


export const rnvRun = async (c) => {
    logTask(`rnvRun:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await _rnvRunWithPlatform(c);
};

export const rnvPackage = async (c) => {
    logTask(`rnvPackage:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await _rnvPackageWithPlatform(c);
};

export const rnvBuild = async (c) => {
    logTask(`rnvBuild:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await _rnvBuildWithPlatform(c);
};

export const rnvExport = async (c) => {
    logTask(`rnvExport:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await _rnvExportWithPlatform(c);
};

export const rnvDeploy = async (c) => {
    logTask(`rnvDeploy:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await _rnvDeployWithPlatform(c);
};

export const rnvLog = async (c) => {
    switch (c.platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        await runAndroidLog(c);
        return;
    case IOS:
    case TVOS:
        await runAppleLog(c);
        return;
    }

    logErrorPlatform(c, c.platform);
};

// ##########################################
// PRIVATE
// ##########################################

const _isWebHostEnabled = (c, platform) => {
    const { hosted, debug } = c.program;
    // if (debug) return false;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets');
    return (hosted || !bundleAssets) && WEB_HOSTED_PLATFORMS.includes(platform);
};


const _configureHostedIfRequired = async (c, platform) => {
    if (_isWebHostEnabled(c, platform)) {
        logDebug('Running hosted build');
        const { project, rnv } = c.paths;
        copyFolderContentsRecursiveSync(path.join(rnv.dir, 'supportFiles', 'appShell'), path.join(project.dir, 'platformBuilds', `${c.runtime.appId}_${platform}`, 'public'));
        writeCleanFile(path.join(rnv.dir, 'supportFiles', 'appShell', 'index.html'), path.join(project.dir, 'platformBuilds', `${c.runtime.appId}_${platform}`, 'public', 'index.html'), [
            { pattern: '{{DEV_SERVER}}', override: `http://${ip.address()}:${c.platformDefaults[platform].defaultPort}` },
        ]);
    }
};

const _startHostedServerIfRequired = (c, platform) => {
    if (_isWebHostEnabled(c, platform)) {
        return rnvStart(c);
    }
};

const startBundlerIfRequired = async (c) => {
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;

    const isRunning = await isBundlerRunning();
    if (!isRunning) {
        rnvStart(c);
        keepRNVRunning = true;
        await waitForBundler();
    } else {
        logInfo('Bundler already running. Using it');
    }
};

const waitForBundlerIfRequired = async (c) => {
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;
    // return a new promise that does...nothing, just to keep RNV running while the bundler is running
    if (keepRNVRunning) return new Promise(() => {});
    return true;
};

const _rnvRunWithPlatform = async (c) => {
    logTask(`_rnvRunWithPlatform:${c.platform}`);
    const { platform } = c;
    const port = c.program.port || c.platformDefaults[platform].defaultPort;
    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];
    const { hosted } = c.program;

    logTask(`_rnvRunWithPlatform:${platform}:${port}:${target}`, chalk.grey);

    const throwErr = (err) => {
        throw err;
    };

    if (_isWebHostEnabled(c, platform) && hosted) {
        return rnvStart(c, true);
        // logWarning(`Platform ${platform} does not support --hosted mode. Ignoring`);
    }

    switch (platform) {
    case IOS:
    case TVOS:
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await startBundlerIfRequired(c);
            await runXcodeProject(c, platform, target);
            return waitForBundlerIfRequired(c);
        }
        return runXcodeProject(c, platform, target);
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('android');
        }
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await startBundlerIfRequired(c);
            if (getConfigProp(c, platform, 'bundleAssets') === true || platform === ANDROID_WEAR) {
                await packageAndroid(c, platform);
            }
            await runAndroid(c, platform, target);
            return waitForBundlerIfRequired(c);
        }
        return runAndroid(c, platform, target);
    case MACOS:
    case WINDOWS:
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
        }
        return runElectron(c, platform, port);
    case WEB:
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
        }
        return runWeb(c, platform, port, true);
    case TIZEN:
    case TIZEN_MOBILE:
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('tizen');
        }
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await _configureHostedIfRequired(c, platform);
        }
        await runTizen(c, platform, target);
        return _startHostedServerIfRequired(c, platform);
    case WEBOS:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('webos');
        }
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await _configureHostedIfRequired(c, platform);
        }
        await runWebOS(c, platform, target);
        return _startHostedServerIfRequired(c, platform);
    case KAIOS:
    case FIREFOX_OS:
    case FIREFOX_TV:
        if (platform === KAIOS && !checkSdk(c, platform, throwErr)) return;
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
        }
        return runFirefoxProject(c, platform);
    default:
        return logErrorPlatform(c, platform);
    }
};

const _rnvPackageWithPlatform = async (c) => {
    logTask(`_rnvPackageWithPlatform:${c.platform}`);
    const { platform } = c;

    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];

    switch (platform) {
    case IOS:
    case TVOS:
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
        }
        return packageBundleForXcode(c, platform);
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        checkSdk(c, platform);
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await configureGradleProject(c, platform);
        }
        return packageAndroid(c, platform, target, platform === ANDROID_WEAR);
    }

    logErrorPlatform(c, platform);
};

const _rnvExportWithPlatform = async (c) => {
    logTask(`_rnvExportWithPlatform:${c.platform}`);
    const { platform } = c;
    switch (platform) {
    case WEB:
        if (!c.program.only) {
            await rnvBuild(c);
        }
        return exportWeb(c, platform);
    case IOS:
    case TVOS:
        if (!c.program.only) {
            await _rnvBuildWithPlatform(c, platform);
        }
        return exportXcodeProject(c, platform);
    case MACOS:
    case WINDOWS:
        if (!c.program.only) {
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await configureElectronProject(c, platform);
            await buildElectron(c, platform);
        }
        return exportElectron(c, platform);
    }

    logErrorPlatform(c, platform);
};

const _rnvDeployWithPlatform = async (c) => {
    logTask(`_rnvDeployWithPlatform:${c.platform}`);
    const { platform } = c;

    switch (platform) {
    case WEB:
        if (!c.program.only) {
            await rnvBuild(c);
        }
        return deployWeb(c, platform);
    case TVOS:
    case IOS:
        if (!c.program.only) {
            return _rnvExportWithPlatform(c);
        }
        return;
    // case WEBOS:
    case TIZEN:
        if (!c.program.only) {
            await rnvBuild(c);
        }
        return;
    case ANDROID_TV:
    case ANDROID:
        if (!c.program.only) {
            return _rnvBuildWithPlatform(c);
        }
        return;
    default:
        logErrorPlatform(c, platform);
    }
};

const _rnvBuildWithPlatform = async (c) => {
    logTask(`_rnvBuildWithPlatform:${c.platform}`);
    const { platform } = c;

    switch (platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await configureGradleProject(c, platform);
        await packageAndroid(c, platform);
        await buildAndroid(c, platform);
        return;
    case MACOS:
    case WINDOWS:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await configureElectronProject(c, platform);
        await buildElectron(c, platform);
        return;
    case IOS:
    case TVOS:
        if (!c.program.only) {
            await _rnvPackageWithPlatform(c, platform);
        }
        await archiveXcodeProject(c, platform);
        return;
    case WEB:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await buildWeb(c, platform);
        return;
    case KAIOS:
    case FIREFOX_OS:
    case FIREFOX_TV:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await buildFirefoxProject(c, platform);
        return;
    case TIZEN:
    case TIZEN_MOBILE:
    case TIZEN_WATCH:
        checkSdk(c, platform);
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await buildTizenProject(c, platform);
        return;
    case WEBOS:
        checkSdk(c, platform);
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await buildWebOSProject(c, platform);
        return;
    }

    logErrorPlatform(c, platform);
};
