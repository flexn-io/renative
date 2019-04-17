import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
    isPlatformSupported, getConfig, logTask, logComplete, checkSdk,
    logError, getAppFolder, logDebug, logErrorPlatform, isSdkInstalled, logWarning, configureIfRequired,
} from '../common';
import {
    IOS, TVOS, ANDROID, WEB, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, MACOS, WINDOWS, TIZEN_WATCH, KAIOS,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
} from '../constants';
import { executeAsync, execCLI } from '../exec';
import { runXcodeProject, exportXcodeProject, archiveXcodeProject, packageBundleForXcode, launchAppleSimulator, runAppleLog } from '../platformTools/apple';
import { buildWeb, runWeb } from '../platformTools/web';
import { runTizen } from '../platformTools/tizen';
import { runWebOS } from '../platformTools/webos';
import { runKaiOS } from '../platformTools/kaios';
import { runElectron } from '../platformTools/electron';
import { packageAndroid, runAndroid, configureAndroidProperties, configureGradleProject, buildAndroid, runAndroidLog } from '../platformTools/android';
import appRunner, { copyRuntimeAssets } from './app';


const RUN = 'run';
const LOG = 'log';
const START = 'start';
const PACKAGE = 'package';
const BUILD = 'build';
const DEPLOY = 'deploy';
const UPDATE = 'update';
const EXPORT = 'export';
const TEST = 'test';
const DOC = 'doc';
const UNINSTALL = 'uninstall';

const PIPES = {
    RUN_BEFORE: 'run:before',
    RUN_AFTER: 'run:after',
    LOG_BEFORE: 'log:before',
    LOG_AFTER: 'log:after',
    START_BEFORE: 'start:before',
    START_AFTER: 'start:after',
    PACKAGE_BEFORE: 'package:before',
    PACKAGE_AFTER: 'package:after',
    BUILD_BEFORE: 'build:before',
    BUILD_AFTER: 'build:after',
    DEPLOY_BEFORE: 'deploy:before',
    DEPLOY_AFTER: 'deploy:after',
};


// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.command) {
    case RUN:
        return _runApp(c);
        break;
    case START:
        return _start(c);
        break;
    case EXPORT:
        return _export(c);
        break;
    case PACKAGE:
        return _packageApp(c);
        break;
    case BUILD:
        return _build(c);
        break;
    case LOG:
        return _log(c);
        break;
    // case DEPLOY:
    //     return Promise.resolve();
    //     break;
    // case UPDATE:
    //     return Promise.resolve();
    //     break;
    // case TEST:
    //     return Promise.resolve();
    //     break;
    // case DOC:
    //     return Promise.resolve();
    //     break;
    default:
        return Promise.reject(`Command ${c.command} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _start = c => new Promise((resolve, reject) => {
    if (c.program.reset) {
        shell.exec('node ./node_modules/react-native/local-cli/cli.js start --reset-cache');
    } else {
        shell.exec('node ./node_modules/react-native/local-cli/cli.js start');
    }
});

const _runApp = c => new Promise((resolve, reject) => {
    logTask('_runApp');
    const { platform } = c;
    if (!isPlatformSupported(platform, null, reject)) return;

    const target = c.program.target || c.globalConfig.defaultTargets[platform];

    switch (platform) {
    case IOS:
    case TVOS:
        configureIfRequired(c, platform)
            .then(() => runXcodeProject(c, platform, target))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, reject)) return;

        configureIfRequired(c, platform)
            .then(() => configureAndroidProperties(c))
            .then(() => configureGradleProject(c, platform))
            .then(() => _runAndroid(c, platform, target, platform === ANDROID_WEAR))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case MACOS:
    case WINDOWS:
        configureIfRequired(c, platform)
            .then(() => runElectron(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEB:
        configureIfRequired(c, platform)
            .then(() => runWeb(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case TIZEN:
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, reject)) return;

        configureIfRequired(c, platform)
            .then(() => runTizen(c, platform, target))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEBOS:
        if (!checkSdk(c, platform, reject)) return;

        configureIfRequired(c, platform)
            .then(() => runWebOS(c, platform, target))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case KAIOS:
        if (!checkSdk(c, platform, reject)) return;

        configureIfRequired(c, platform)
            .then(() => runKaiOS(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _packageApp = c => new Promise((resolve, reject) => {
    logTask('_packageApp');
    const { platform } = c;
    if (!isPlatformSupported(platform, null, reject)) return;

    const target = c.program.target || c.globalConfig.defaultTargets[platform];

    switch (platform) {
    case IOS:
    case TVOS:
        configureIfRequired(c, platform)
            .then(() => packageBundleForXcode(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, reject)) return;

        configureIfRequired(c, platform)
            .then(() => configureAndroidProperties(c))
            .then(() => configureGradleProject(c, platform))
            .then(() => packageAndroid(c, platform, target, platform === ANDROID_WEAR))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});


const _export = c => new Promise((resolve, reject) => {
    logTask('_export');
    const { platform } = c;
    if (!isPlatformSupported(platform, null, reject)) return;

    switch (platform) {
    case IOS:
    case TVOS:
        configureIfRequired(c, platform)
            .then(() => archiveXcodeProject(c, platform))
            .then(() => exportXcodeProject(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _build = c => new Promise((resolve, reject) => {
    logTask('_build');
    const { platform } = c;
    if (!isPlatformSupported(platform, null, reject)) return;

    switch (platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        configureIfRequired(c, platform)
            .then(() => configureAndroidProperties(c))
            .then(() => configureGradleProject(c, platform))
            .then(() => packageAndroid(c, platform))
            .then(() => buildAndroid(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEB:
        configureIfRequired(c, platform)
            .then(() => buildWeb(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _log = c => new Promise((resolve, reject) => {
    logTask('_log');
    const { platform } = c;
    if (!isPlatformSupported(platform, null, reject)) return;

    switch (platform) {
    case IOS:
    case TVOS:
        runAppleLog(c, platform)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        runAndroidLog(c, platform)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _runAndroid = (c, platform, target, forcePackage) => new Promise((resolve, reject) => {
    logTask(`_runAndroid:${platform}`);

    const appFolder = getAppFolder(c, platform);
    if (c.appConfigFile.platforms.android.runScheme === 'Release' || forcePackage) {
        packageAndroid(c, platform).then(() => {
            runAndroid(c, platform, target).then(() => resolve()).catch(e => reject(e));
        });
    } else {
        runAndroid(c, platform, target).then(() => resolve()).catch(e => reject(e));
    }
});

export { PIPES };

export default run;
