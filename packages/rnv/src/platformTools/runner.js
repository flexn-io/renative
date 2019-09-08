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


const PIPES = {
    RUN_BEFORE: 'run:before',
    RUN_AFTER: 'run:after',
    LOG_BEFORE: 'log:before',
    LOG_AFTER: 'log:after',
    START_BEFORE: 'start:before',
    START_AFTER: 'start:after',
    PACKAGE_BEFORE: 'package:before',
    PACKAGE_AFTER: 'package:after',
    EXPORT_BEFORE: 'export:before',
    EXPORT_AFTER: 'export:after',
    BUILD_BEFORE: 'build:before',
    BUILD_AFTER: 'build:after',
    DEPLOY_BEFORE: 'deploy:before',
    DEPLOY_AFTER: 'deploy:after',
};

// ##########################################
// PUBLIC API
// ##########################################


export const rnvStart = c => new Promise((resolve, reject) => {
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
        executePipe(c, PIPES.START_BEFORE)
            .then(() => configureIfRequired(c, platform))
            .then(() => runWebDevServer(c, platform, port))
            .then(() => executePipe(c, PIPES.START_AFTER))
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

    executePipe(c, PIPES.START_BEFORE)
        .then(() => {
            shell.exec(startCmd);
        })
        .catch(e => reject(e));
});

const runWeinre = () => {
    shell.exec('npx weinre --boundHost -all-');
};

export const rnvDebug = c => executePipe(c, PIPES.START_BEFORE)
    .then(() => runWeinre())
    .then(() => executePipe(c, PIPES.START_AFTER));


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

const _fix = c => new Promise((resolve, reject) => {
    cleanNodeModules(c).then(() => resolve()).catch(e => reject(e));
});

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
        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runXcodeProject(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER));
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('android');
        }

        await executePipe(c, PIPES.RUN_BEFORE);
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await _runAndroid(c, platform, target, platform === ANDROID_WEAR);
        await executePipe(c, PIPES.RUN_AFTER);
        return;
    case MACOS:
    case WINDOWS:
        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runElectron(c, platform, port))
            .then(() => executePipe(c, PIPES.RUN_AFTER));
    case WEB:
        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runWeb(c, platform, port))
            .then(() => executePipe(c, PIPES.RUN_AFTER));
    case TIZEN:
    case TIZEN_MOBILE:
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('tizen');
        }

        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => _configureHostedIfRequired(c, platform))
            .then(() => runTizen(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => _startHostedServerIfRequired(c, platform));
    case WEBOS:
        if (!checkSdk(c, platform, logError)) {
            const setupInstance = PlatformSetup(c);
            await setupInstance.askToInstallSDK('webos');
        }

        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => _configureHostedIfRequired(c, platform))
            .then(() => runWebOS(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => _startHostedServerIfRequired(c, platform));
    case KAIOS:
    case FIREFOX_OS:
    case FIREFOX_TV:
        if (platform === KAIOS && !checkSdk(c, platform, throwErr)) return;

        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runFirefoxProject(c, platform))
            .then(() => executePipe(c, PIPES.RUN_AFTER));
    default:
        break;
    }

    return logErrorPlatform(platform);
};

const _rnvPackageWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_rnvPackageWithPlatform:${c.platform}`);
    const { platform } = c;

    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];

    switch (platform) {
    case IOS:
    case TVOS:
        executePipe(c, PIPES.PACKAGE_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => packageBundleForXcode(c, platform))
            .then(() => executePipe(c, PIPES.PACKAGE_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, reject)) return;

        executePipe(c, PIPES.PACKAGE_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => configureGradleProject(c, platform))
            .then(() => packageAndroid(c, platform, target, platform === ANDROID_WEAR))
            .then(() => executePipe(c, PIPES.PACKAGE_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _rnvExportWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_rnvExportWithPlatform:${c.platform}`);
    const { platform } = c;
    switch (platform) {
    case IOS:
    case TVOS:
        executePipe(c, PIPES.EXPORT_BEFORE)
            .then(() => (c.program.only ? Promise.resolve() : _rnvBuildWithPlatform(c, platform)))
            .then(() => exportXcodeProject(c, platform))
            .then(() => executePipe(c, PIPES.EXPORT_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case MACOS:
    case WINDOWS:
        executePipe(c, PIPES.EXPORT_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => configureElectronProject(c, platform))
            .then(() => buildElectron(c, platform))
            .then(() => exportElectron(c, platform))
            .then(() => executePipe(c, PIPES.EXPORT_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _rnvDeployWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_rnvDeployWithPlatform:${c.platform}`);
    const { platform } = c;

    switch (platform) {
    case WEB:
        executePipe(c, PIPES.DEPLOY_BEFORE)
            .then(() => (c.program.only ? Promise.resolve() : rnvBuild(c)))
            .then(() => deployWeb(c, platform))
            .then(() => executePipe(c, PIPES.DEPLOY_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case IOS:
        executePipe(c, PIPES.DEPLOY_BEFORE)
            .then(v => (c.program.only ? Promise.resolve() : _rnvExportWithPlatform(c)))
            .then(() => executePipe(c, PIPES.DEPLOY_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
        executePipe(c, PIPES.DEPLOY_BEFORE)
            .then(v => (c.program.only ? Promise.resolve() : _rnvBuildWithPlatform(c)))
            .then(() => executePipe(c, PIPES.DEPLOY_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _rnvBuildWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_rnvBuildWithPlatform:${c.platform}`);
    const { platform } = c;

    switch (platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => configureGradleProject(c, platform))
            .then(() => packageAndroid(c, platform))
            .then(() => buildAndroid(c, platform))
            .then(() => executePipe(c, PIPES.BUILD_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case MACOS:
    case WINDOWS:
        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => configureElectronProject(c, platform))
            .then(() => buildElectron(c, platform))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case IOS:
    case TVOS:
        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => (c.program.only ? Promise.resolve() : _rnvPackageWithPlatform(c, platform)))
            .then(() => archiveXcodeProject(c, platform))
            .then(() => executePipe(c, PIPES.BUILD_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEB:
        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => buildWeb(c, platform))
            .then(() => executePipe(c, PIPES.BUILD_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case KAIOS:
    case FIREFOX_OS:
    case FIREFOX_TV:
        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => buildFirefoxProject(c, platform))
            .then(() => executePipe(c, PIPES.BUILD_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case TIZEN:
    case TIZEN_MOBILE:
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, reject)) return;

        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => buildTizenProject(c, platform))
            .then(() => executePipe(c, PIPES.BUILD_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEBOS:
        if (!checkSdk(c, platform, reject)) return;

        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => buildWebOSProject(c, platform))
            .then(() => executePipe(c, PIPES.BUILD_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});


const _runAndroid = (c, platform, target, forcePackage) => new Promise((resolve, reject) => {
    logTask(`_runAndroid:${platform}`);

    if (c.buildConfig.platforms[platform].runScheme === 'Release' || forcePackage) {
        packageAndroid(c, platform).then(() => {
            runAndroid(c, platform, target)
                .then(() => resolve())
                .catch(e => reject(e));
        });
    } else {
        runAndroid(c, platform, target)
            .then(() => resolve())
            .catch(e => reject(e));
    }
});
