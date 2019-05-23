import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
    isPlatformSupported,
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    checkSdk,
    logError,
    getAppFolder,
    logDebug,
    logErrorPlatform,
    isSdkInstalled,
    logWarning,
    configureIfRequired,
    cleanPlatformIfRequired,
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
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBBOS_ARES_INSTALL,
    CLI_WEBBOS_ARES_LAUNCH,
} from '../constants';
import { executeAsync, execCLI } from '../exec';
import {
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    launchAppleSimulator,
    runAppleLog,
    prepareXcodeProject,
} from '../platformTools/apple';
import { buildWeb, runWeb, runWebDevServer } from '../platformTools/web';
import { runTizen } from '../platformTools/tizen';
import { runWebOS } from '../platformTools/webos';
import { runFirefoxProject, buildFirefoxProject } from '../platformTools/firefox';
import { runElectron, buildElectron, runElectronDevServer } from '../platformTools/electron';
import { executePipe } from '../buildHooks';
import {
    packageAndroid,
    runAndroid,
    configureAndroidProperties,
    configureGradleProject,
    buildAndroid,
    runAndroidLog,
} from '../platformTools/android';
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
        return _exportApp(c);
        break;
    case PACKAGE:
        return _packageApp(c);
        break;
    case BUILD:
        return _buildApp(c);
        break;
    case LOG:
        return _log(c);
        break;
    case DEPLOY:
        return _deployApp(c);
        break;
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

const _start = (c, platform) => new Promise((resolve, reject) => {
    const { platform } = c;
    const port = c.program.port || c.defaultPorts[platform];

    logTask(`_start:${platform}:${port}`);

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
        executePipe(c, PIPES.START_BEFORE)
            .then(() => configureIfRequired(c, platform))
            .then(() => runWebDevServer(c, platform, port))
            .then(() => executePipe(c, PIPES.START_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    if (c.program.reset) {
        shell.exec('node ./node_modules/react-native/local-cli/cli.js start --reset-cache');
    } else {
        shell.exec('node ./node_modules/react-native/local-cli/cli.js start');
    }
});

const _runApp = c => new Promise((resolve, reject) => {
    logTask(`_runApp:${c.platform}`);

    isPlatformSupported(c)
        .then(v => _runAppWithPlatform(c))
        .catch(e => reject(e));
});

const _runAppWithPlatform = c => new Promise((resolve, reject) => {
    const { platform } = c;
    const port = c.program.port || c.defaultPorts[platform];
    const target = c.program.target || c.globalConfig.defaultTargets[platform];

    logTask(`_runAppWithPlatform:${platform}:${port}`);

    switch (platform) {
    case IOS:
    case TVOS:
        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => prepareXcodeProject(c, platform))
            .then(() => runXcodeProject(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, reject)) return;

        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => configureAndroidProperties(c))
            .then(() => configureGradleProject(c, platform))
            .then(() => _runAndroid(c, platform, target, platform === ANDROID_WEAR))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case MACOS:
    case WINDOWS:
        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runElectron(c, platform, port))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEB:
        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runWeb(c, platform, port))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case TIZEN:
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, reject)) return;

        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runTizen(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEBOS:
        if (!checkSdk(c, platform, reject)) return;

        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runWebOS(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case KAIOS:
    case FIREFOX_OS:
    case FIREFOX_TV:
        if (platform === KAIOS && !checkSdk(c, platform, reject)) return;

        executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runFirefoxProject(c, platform))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _packageApp = c => new Promise((resolve, reject) => {
    logTask(`_packageApp:${c.platform}`);

    isPlatformSupported(c)
        .then(v => _packageAppWithPlatform(c))
        .catch(e => reject(e));
});

const _packageAppWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_packageAppWithPlatform:${c.platform}`);
    const { platform } = c;

    const target = c.program.target || c.globalConfig.defaultTargets[platform];

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
            .then(() => configureAndroidProperties(c))
            .then(() => configureGradleProject(c, platform))
            .then(() => packageAndroid(c, platform, target, platform === ANDROID_WEAR))
            .then(() => executePipe(c, PIPES.PACKAGE_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _exportApp = c => new Promise((resolve, reject) => {
    logTask(`_exportApp:${c.platform}`);

    isPlatformSupported(c)
        .then(v => _exportAppWithPlatform(c))
        .catch(e => reject(e));
});

const _exportAppWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_exportAppWithPlatform:${c.platform}`);
    const { platform } = c;
    switch (platform) {
    case IOS:
    case TVOS:
        executePipe(c, PIPES.EXPORT_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => prepareXcodeProject(c, platform))
            .then(() => packageBundleForXcode(c, platform))
            .then(() => archiveXcodeProject(c, platform))
            .then(() => exportXcodeProject(c, platform))
            .then(() => executePipe(c, PIPES.EXPORT_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _deployApp = c => new Promise((resolve, reject) => {
    logTask(`_deployApp:${c.platform}`);
    const { platform } = c;
    if (!isPlatformSupportedSync(platform, null, reject)) return;

    // switch (platform) {
    // case IOS:
    // case TVOS:
    // case TVOS:
    executePipe(c, PIPES.DEPLOY_BEFORE)
    // .then(() => cleanPlatformIfRequired(c, platform))
    // .then(() => configureIfRequired(c, platform))
    // TODO: ADD INTEGRATIONS
        .then(() => executePipe(c, PIPES.DEPLOY_AFTER))
        .then(() => resolve())
        .catch(e => reject(e));
    return;
    // }

    logErrorPlatform(platform, resolve);
});

const _buildApp = c => new Promise((resolve, reject) => {
    logTask(`_buildApp:${c.platform}`);

    isPlatformSupported(c)
        .then(v => _buildAppWithPlatform(c))
        .catch(e => reject(e));
});

const _buildAppWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_buildAppWithPlatform:${c.platform}`);
    const { platform } = c;

    switch (platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => configureAndroidProperties(c))
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
            .then(() => buildElectron(c, platform))
            .then(() => executePipe(c, PIPES.RUN_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case IOS:
    case TVOS:
        executePipe(c, PIPES.BUILD_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => prepareXcodeProject(c, platform))
            .then(() => packageBundleForXcode(c, platform))
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
    }

    logErrorPlatform(platform, resolve);
});

const _log = c => new Promise((resolve, reject) => {
    logTask('_log');
    const { platform } = c;
    if (!isPlatformSupportedSync(platform, null, reject)) return;

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

export { PIPES };

export default run;
