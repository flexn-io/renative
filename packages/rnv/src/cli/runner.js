
import path from 'path';
import shell from 'shelljs';
import {
    IOS, TVOS, ANDROID, WEB, isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logDebug, logErrorPlatform,
} from '../common';
import { executeAsync } from '../exec';

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
    case PACKAGE:
        return Promise.resolve();
        break;
    case BUILD:
        return Promise.resolve();
        break;
    case DEPLOY:
        return Promise.resolve();
        break;
    case UPDATE:
        return Promise.resolve();
        break;
    case TEST:
        return Promise.resolve();
        break;
    case DOC:
        return Promise.resolve();
        break;
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _runApp = c => new Promise((resolve, reject) => {
    logTask('_runApp');
    const { platform } = c;
    if (!isPlatformSupported(platform, resolve)) return;

    switch (platform) {
    case IOS:
        _runiOS(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case TVOS:
        _runtvOS(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ANDROID:
        _runAndroid(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case WEB:
        _runWeb(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _updateApp = c => new Promise((resolve, reject) => {
    const platform = c.platform;
    if (!isPlatformSupported(platform, resolve)) return;

    switch (platform) {
    case IOS:
        _runiOSUpdate(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case TVOS:
        _runtvOSUpdate(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(c.platform, resolve);
});

const _runAndroid = c => new Promise((resolve, reject) => {
    logTask('_runAndroid');

    const appFolder = getAppFolder(c, ANDROID);
    if (c.appConfigFile.platforms.android.runScheme === 'Release') {
        _packageAndroid(c).then(() => {
            shell.cd(`${appFolder}`);
            shell.exec('./gradlew appStart');
            resolve();
        });
    } else {
        shell.cd(`${appFolder}`);
        shell.exec('./gradlew appStart');
        resolve();
    }
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

const _packageAndroid = (c) => {
    logTask('_packageAndroid');

    const appFolder = getAppFolder(c, ANDROID);
    return executeAsync('react-native', [
        'bundle',
        '--platform',
        'android',
        '--dev',
        'false',
        '--assets-dest',
        `${appFolder}/app/src/main/res`,
        '--entry-file',
        `${c.appConfigFile.platforms.android.entryFile}.js`,
        '--bundle-output',
        `${appFolder}/app/src/main/assets/index.android.bundle`,
    ]);
};

const iosPlatforms = [IOS, TVOS];
const _runiOSUpdate = (c) => {
    logTask('_runiOSUpdate');
    if (iosPlatforms.includes(c.platform)) {
        return _runPod('update', getAppFolder(c, IOS));
    }

    return Promise().resolve();
};

const _runtvOSUpdate = (c) => {
    logTask('_runtvOSUpdate');
    if (iosPlatforms.includes(c.platform)) {
        return _runPod('update', getAppFolder(c, TVOS));
    }

    return Promise().resolve();
};

const _runiOSInstall = (c) => {
    logTask('_runiOSInstall');

    return _runPod('install', getAppFolder(c, IOS));
};

const _runPod = (cmd, cwd) => executeAsync('pod', [
    'update',
], {
    cwd,
    evn: process.env,
    stdio: 'inherit',
});

const _runiOS = (c) => {
    logTask('_runiOS');
    const device = c.program.simulator || 'iPhone 6';
    const appPath = getAppFolder(c, IOS);
    const p = [
        'run-ios',
        '--project-path',
        appPath,
        '--simulator',
        device,
        '--scheme',
        c.appConfigFile.platforms.ios.scheme,
        '--configuration',
        c.appConfigFile.platforms.ios.runScheme,
    ];
    logDebug('running', p);
    if (c.appConfigFile.platforms.ios.runScheme === 'Release') {
        iosPackage(buildConfig).then(v => executeAsync('react-native', p));
    } else {
        return executeAsync('react-native', p);
    }
};

const _runtvOS = (c) => {
    logTask('_runtvOS');
    const device = c.program.simulator || 'Apple TV 4K';
    const appPath = getAppFolder(c, TVOS);
    const p = [
        'run-ios',
        '--project-path',
        appPath,
        '--simulator',
        device,
        '--scheme',
        c.appConfigFile.platforms.tvos.scheme,
        '--configuration',
        c.appConfigFile.platforms.tvos.runScheme,
    ];
    logDebug('running', p);
    if (c.appConfigFile.platforms.ios.runScheme === 'Release') {
        iosPackage(buildConfig).then(v => executeAsync('react-native', p));
    } else {
        return executeAsync('react-native', p);
    }
};

export default run;
