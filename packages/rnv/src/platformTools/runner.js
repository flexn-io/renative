/* eslint-disable import/no-cycle */
// @todo fix circular
import shell from 'shelljs';
import chalk from 'chalk';
import open from 'open';
import ip from 'ip';
import path from 'path';

import {
    isPlatformSupported,
    isBuildSchemeSupported,
    isPlatformSupportedSync,
    logTask,
    logError,
    checkSdk,
    logErrorPlatform,
    configureIfRequired,
    cleanPlatformIfRequired,
    logInfo,
    logDebug,
    logWarning,
    writeCleanFile,
    getConfigProp,
    waitForWebpack
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
    WEB_HOSTED_PLATFORMS
} from '../constants';
import {
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    runAppleLog,
    configureXcodeProject,
} from './apple';
import { buildWeb, runWeb, runWebDevServer, deployWeb } from './web';
import { runTizen, buildTizenProject } from './tizen';
import { runWebOS, buildWebOSProject } from './webos';
import { runFirefoxProject, buildFirefoxProject } from './firefox';
import {
    runElectron,
    buildElectron, runElectronDevServer, configureElectronProject, exportElectron
} from './electron';
import PlatformSetup from '../setupTools';
import { executePipe } from '../projectTools/buildHooks';
import { cleanNodeModules } from '../projectTools/projectParser';
import {
    packageAndroid,
    runAndroid,
    configureGradleProject,
    buildAndroid,
    runAndroidLog,
} from './android';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../systemTools/fileutils';

const isRunningOnWindows = process.platform === 'win32';

// ##########################################
// PUBLIC API
// ##########################################


export const rnvStart = async c => new Promise((resolve, reject) => {
    const { platform } = c;
    const port = c.program.port || c.platformDefaults[platform] ? c.platformDefaults[platform].defaultPort : null;
    const { hosted } = c.program;

    logTask(`rnvStart:${platform}:${port}`);

    if (_isWebHostEnabled(c, platform) && hosted) {
        const hostIp = isRunningOnWindows ? '127.0.0.1' : '0.0.0.0';
        waitForWebpack(port)
            .then(() => open(`http://${hostIp}:${port}/`))
            .catch(logError);
    }

    switch (platform) {
    case MACOS:
    case WINDOWS:
        executePipe(c, PIPES.START_BEFORE)
            .then(() => runElectronDevServer(c, platform, port))
            .then(() => executePipe(c, PIPES.START_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEB:
    case TIZEN:
    case WEBOS:
    case TIZEN_MOBILE:
    case TIZEN_WATCH:
        configureIfRequired(c, platform)
            .then(() => runWebDevServer(c, platform, port))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    default:
        if (hosted) {
            return logError('This platform does not support hosted mode', true);
        }
    }

    let startCmd;
    if (c.program.reset) {
        startCmd = 'node ./node_modules/react-native/local-cli/cli.js start --reset-cache';
    } else {
        startCmd = 'node ./node_modules/react-native/local-cli/cli.js start';
    }

    shell.exec(startCmd)
        .catch(e => reject(e));
});

const runWeinre = () => {
    shell.exec('npx weinre --boundHost -all-');
};

export const rnvDebug = async (c) => {
    logTask(`rnvDebug:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await runWeinre();
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

const rnvLog = async (c) => {
    logTask('rnvLog');
    const { platform } = c;

    await isPlatformSupported(c);

    switch (platform) {
    case IOS:
    case TVOS:
        await runAppleLog(c, platform);
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        await runAndroidLog(c, platform);
        return;
    }

    logErrorPlatform(platform, resolve);
};

// ##########################################
// PRIVATE
// ##########################################

const _fix = async (c) => {
    await cleanNodeModules(c);
};

const _isWebHostEnabled = (c, platform) => {
    const { hosted } = c.program;
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

const _rnvRunWithPlatform = async (c) => {
    logTask(`_rnvRunWithPlatform:${c.platform}`);
    const { platform } = c;
    const port = c.program.port || c.platformDefaults[platform].defaultPort;
    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];
    const { device, hosted } = c.program;

    logTask(`_rnvRunWithPlatform:${platform}:${port}:${target}`, chalk.grey);

    const throwErr = (err) => {
        throw err;
    };

    if (_isWebHostEnabled(c, platform) && hosted) {
        return rnvStart(c);
        // logWarning(`Platform ${platform} does not support --hosted mode. Ignoring`);
    }

    switch (platform) {
    case IOS:
    case TVOS:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await runXcodeProject(c, platform, target);
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('android');
        }

        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await _runAndroid(c, platform, target, platform === ANDROID_WEAR);
        return;
    case MACOS:
    case WINDOWS:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await runElectron(c, platform, port);
        return;
    case WEB:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await runWeb(c, platform, port);
        return;
    case TIZEN:
    case TIZEN_MOBILE:
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('tizen');
        }
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await _configureHostedIfRequired(c, platform);
        await runTizen(c, platform, target);
        await executePipe(c, PIPES.RUN_AFTER);
        await _startHostedServerIfRequired(c, platform);
        return;
    case WEBOS:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('webos');
        }
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await _configureHostedIfRequired(c, platform);
        await runWebOS(c, platform, target);
        await _startHostedServerIfRequired(c, platform);
        return;
    case KAIOS:
    case FIREFOX_OS:
    case FIREFOX_TV:
        if (platform === KAIOS && !checkSdk(c, platform, throwErr)) return;

        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await runFirefoxProject(c, platform);
        return;
    default:
        break;
    }

    return logErrorPlatform(platform);
};

const _rnvPackageWithPlatform = async (c) => {
    logTask(`_rnvPackageWithPlatform:${c.platform}`);
    const { platform } = c;

    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];

    switch (platform) {
    case IOS:
    case TVOS:
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await packageBundleForXcode(c, platform);
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, reject)) return;
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await configureGradleProject(c, platform);
        await packageAndroid(c, platform, target, platform === ANDROID_WEAR);
        return;
    }

    logErrorPlatform(platform, resolve);
};

const _rnvExportWithPlatform = async (c) => {
    logTask(`_rnvExportWithPlatform:${c.platform}`);
    const { platform } = c;
    switch (platform) {
    case IOS:
    case TVOS:
        if (!c.program.only) {
            await _rnvBuildWithPlatform(c, platform);
        }
        await exportXcodeProject(c, platform);
        return;
    case MACOS:
    case WINDOWS:

        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await configureElectronProject(c, platform);
        await buildElectron(c, platform);
        await exportElectron(c, platform);

        return;
    }

    logErrorPlatform(platform, resolve);
};

const _rnvDeployWithPlatform = async (c) => {
    logTask(`_rnvDeployWithPlatform:${c.platform}`);
    const { platform } = c;

    switch (platform) {
    case WEB:
        if (!c.program.only) {
            await rnvBuild(c);
        }
        await deployWeb(c, platform);
        return;
    case IOS:
        if (!c.program.only) {
            await _rnvExportWithPlatform(c);
        }

        return;
    case ANDROID:
        if (!c.program.only) {
            await _rnvBuildWithPlatform(c);
        }
        return;
    }

    logErrorPlatform(platform, resolve);
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
        if (!checkSdk(c, platform, reject)) return;
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await buildTizenProject(c, platform);
        return;
    case WEBOS:
        if (!checkSdk(c, platform, reject)) return;
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await buildWebOSProject(c, platform);
        return;
    }

    logErrorPlatform(platform, resolve);
};


const _runAndroid = async (c, platform, target, forcePackage) => {
    logTask(`_runAndroid:${platform}`);

    if (c.buildConfig.platforms[platform].runScheme === 'Release' || forcePackage) {
        await packageAndroid(c, platform);
        await runAndroid(c, platform, target);
    } else {
        await runAndroid(c, platform, target);
    }
};
