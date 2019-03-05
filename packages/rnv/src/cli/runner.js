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
import { runXcodeProject } from '../platformTools/apple';
import { buildWeb } from '../platformTools/web';
import { runTizen } from '../platformTools/tizen';
import { runWebOS } from '../platformTools/webos';
import { runKaiOS } from '../platformTools/kaios';
import { packageAndroid, runAndroid, configureAndroidProperties, configureGradleProject } from '../platformTools/android';
import appRunner, { copyRuntimeAssets } from './app';


const RUN = 'run';
const PACKAGE = 'package';
const BUILD = 'build';
const DEPLOY = 'deploy';
const UPDATE = 'update';
const TEST = 'test';
const DOC = 'doc';


// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.command) {
    case RUN:
        return _runApp(c);
        break;
    // case PACKAGE:
    //     return Promise.resolve();
    //     break;
    // case BUILD:
    //     return Promise.resolve();
    //     break;
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

const _runApp = c => new Promise((resolve, reject) => {
    logTask('_runApp');
    const { platform } = c;
    if (!isPlatformSupported(platform, null, reject)) return;


    switch (platform) {
    case IOS:
        configureIfRequired(c, platform)
            .then(() => runXcodeProject(c, platform, 'iPhone 6'))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case TVOS:
        configureIfRequired(c, platform)
            .then(() => runXcodeProject(c, platform, 'Apple TV 4K'))
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
            .then(() => _runAndroid(c, platform, platform === ANDROID_WEAR))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case MACOS:
    case WINDOWS:
        configureIfRequired(c, platform)
            .then(() => _runElectron(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEB:
        configureIfRequired(c, platform)
            .then(() => _runWeb(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case TIZEN:
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, reject)) return;

        configureIfRequired(c, platform)
            .then(() => runTizen(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEBOS:
        if (!checkSdk(c, platform, reject)) return;

        configureIfRequired(c, platform)
            .then(() => runWebOS(c, platform))
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

const _runAndroid = (c, platform, forcePackage) => new Promise((resolve, reject) => {
    logTask(`_runAndroid:${platform}`);

    const appFolder = getAppFolder(c, platform);
    if (c.appConfigFile.platforms.android.runScheme === 'Release' || forcePackage) {
        packageAndroid(c, platform).then(() => {
            runAndroid(c, platform).then(() => resolve()).catch(e => reject(e));
        });
    } else {
        runAndroid(c, platform).then(() => resolve()).catch(e => reject(e));
    }
});

const _runElectron = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_runElectron:${platform}`);

    const appFolder = getAppFolder(c, platform);
    buildWeb(c, platform)
        .then(() => {
            shell.exec(`electron ${appFolder}`);
        });
});

const _runWeb = c => new Promise((resolve, reject) => {
    logTask('_runWeb');

    const appFolder = getAppFolder(c, WEB);
    const wpConfig = path.join(appFolder, 'webpack.config.js');
    const wpPublic = path.join(appFolder, 'public');
    const port = 8080;

    shell.exec(`webpack-dev-server -d --devtool source-map --config ${wpConfig}  --inline --hot --colors --content-base ${wpPublic} --history-api-fallback --host 0.0.0.0 --port ${port}`);
    resolve();
});


export default run;
