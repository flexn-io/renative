/* eslint-disable import/no-cycle */
// @todo fix circular
import shell from 'shelljs';
import inquirer from 'inquirer';
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
    CLI_ANDROID_ADB,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_SDKMANAGER
} from '../constants';
import {
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    runAppleLog,
    prepareXcodeProject,
} from '../platformTools/apple';
import { buildWeb, runWeb, runWebDevServer, deployWeb } from '../platformTools/web';
import { runTizen, buildTizenProject } from '../platformTools/tizen';
import { runWebOS, buildWebOSProject } from '../platformTools/webos';
import { runFirefoxProject, buildFirefoxProject } from '../platformTools/firefox';
import { runElectron, buildElectron, runElectronDevServer } from '../platformTools/electron';
import PlatformSetup from '../setupTools';
import { executePipe } from '../projectTools/buildHooks';
import {
    packageAndroid,
    runAndroid,
    configureAndroidProperties,
    configureGradleProject,
    buildAndroid,
    runAndroidLog,
} from '../platformTools/android';

const RUN = 'run';
const LOG = 'log';
const START = 'start';
const PACKAGE = 'package';
const BUILD = 'build';
const DEPLOY = 'deploy';
// const UPDATE = 'update';
const EXPORT = 'export';
const TEST = 'test';
const DOC = 'doc';
const UNINSTALL = 'uninstall';
const FIX = 'fix';
const DEBUG = 'debug';

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
    case START:
        return _start(c);
    case EXPORT:
        return _exportApp(c);
    case PACKAGE:
        return _packageApp(c);
    case BUILD:
        return _buildApp(c);
    case LOG:
        return _log(c);
    case FIX:
        return _fix(c);
    case DEPLOY:
        return _deployApp(c);
    case DEBUG:
        return _debug(c);
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

const _fix = c => new Promise((resolve, reject) => {
    cleanNodeModules(c).then(() => resolve()).catch(e => reject(e));
});

const _start = c => new Promise((resolve, reject) => {
    const { platform } = c;
    const port = c.program.port || c.platformDefaults[platform] ? c.platformDefaults[platform].defaultPort : null;

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

const runWeinre = () => {
    shell.exec('npx weinre --boundHost -all-');
};

const _debug = c => executePipe(c, PIPES.START_BEFORE)
    .then(() => runWeinre())
    .then(() => executePipe(c, PIPES.START_AFTER));

const _runApp = c => new Promise((resolve, reject) => {
    logTask(`_runApp:${c.platform}`);

    isPlatformSupported(c)
        .then(() => isBuildSchemeSupported(c))
        .then(() => _runAppWithPlatform(c))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runAppWithPlatform = async (c) => {
    logTask(`_runAppWithPlatform:${c.platform}`);
    const { platform } = c;
    const port = c.program.port || c.platformDefaults[platform].defaultPort;
    const target = c.program.target || c.files.globalConfig.defaultTargets[platform];

    logTask(`_runAppWithPlatform:${platform}:${port}`);

    const throwErr = (err) => {
        throw err;
    };

    switch (platform) {
    case IOS:
    case TVOS:
        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => prepareXcodeProject(c, platform))
            .then(() => runXcodeProject(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER));
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, logError)) {
            let sdkInstall;
            if (!c.program.ci) {
                const response = await inquirer.prompt([{
                    name: 'sdkInstall',
                    type: 'confirm',
                    message: 'Do you want to install the Android SDK?',
                }]);
                // eslint-disable-next-line prefer-destructuring
                sdkInstall = response.sdkInstall;
            }

            if (c.program.ci || sdkInstall) {
                const setupInstance = PlatformSetup(c);
                const newPath = await setupInstance.installAndroidSdk();
                // @todo find a more elegant way to update this
                c.files.globalConfig.sdks.ANDROID_SDK = newPath;
                const { sdks: { ANDROID_SDK } } = c.files.globalConfig;
                c.cli[CLI_ANDROID_EMULATOR] = path.join(ANDROID_SDK, 'emulator/emulator');
                c.cli[CLI_ANDROID_ADB] = path.join(ANDROID_SDK, 'platform-tools/adb');
                c.cli[CLI_ANDROID_AVDMANAGER] = path.join(ANDROID_SDK, 'tools/bin/avdmanager');
                c.cli[CLI_ANDROID_SDKMANAGER] = path.join(ANDROID_SDK, 'tools/bin/sdkmanager');
            }
        }

        await executePipe(c, PIPES.RUN_BEFORE);
        await cleanPlatformIfRequired(c, platform);
        await configureIfRequired(c, platform);
        await configureAndroidProperties(c);
        await configureGradleProject(c, platform);
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
    case TIZEN_WATCH:
        if (!checkSdk(c, platform, throwErr)) return;

        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runTizen(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER));
    case WEBOS:
        if (!checkSdk(c, platform, throwErr)) return;

        return executePipe(c, PIPES.RUN_BEFORE)
            .then(() => cleanPlatformIfRequired(c, platform))
            .then(() => configureIfRequired(c, platform))
            .then(() => runWebOS(c, platform, target))
            .then(() => executePipe(c, PIPES.RUN_AFTER));
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

const _packageApp = c => new Promise((resolve, reject) => {
    logTask(`_packageApp:${c.platform}`);

    isPlatformSupported(c)
        .then(v => isBuildSchemeSupported(c))
        .then(v => _packageAppWithPlatform(c))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _packageAppWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_packageAppWithPlatform:${c.platform}`);
    const { platform } = c;

    const target = c.program.target || c.files.globalConfig.defaultTargets[platform];

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
        .then(v => isBuildSchemeSupported(c))
        .then(v => _exportAppWithPlatform(c))
        .then(() => resolve())
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

    isPlatformSupported(c)
        .then(v => isBuildSchemeSupported(c))
        .then(v => _deployAppWithPlatform(c))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _deployAppWithPlatform = c => new Promise((resolve, reject) => {
    logTask(`_deployAppWithPlatform:${c.platform}`);
    const { platform } = c;

    switch (platform) {
    case WEB:
        executePipe(c, PIPES.DEPLOY_BEFORE)
            .then(() => (c.program.only ? Promise.resolve() : _buildApp(c)))
            .then(() => deployWeb(c, platform))
            .then(() => executePipe(c, PIPES.DEPLOY_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case IOS:
        executePipe(c, PIPES.DEPLOY_BEFORE)
            .then(v => isPlatformSupported(c))
            .then(v => isBuildSchemeSupported(c))
            .then(v => _exportAppWithPlatform(c))
            .then(() => executePipe(c, PIPES.DEPLOY_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
        executePipe(c, PIPES.DEPLOY_BEFORE)
            .then(v => isPlatformSupported(c))
            .then(v => isBuildSchemeSupported(c))
            .then(v => _buildAppWithPlatform(c))
            .then(() => executePipe(c, PIPES.DEPLOY_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _buildApp = c => new Promise((resolve, reject) => {
    logTask(`_buildApp:${c.platform}`);

    isPlatformSupported(c)
        .then(v => isBuildSchemeSupported(c))
        .then(v => _buildAppWithPlatform(c))
        .then(() => resolve())
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
    case TIZEN:
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

    if (c.files.appConfigFile.platforms[platform].runScheme === 'Release' || forcePackage) {
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
