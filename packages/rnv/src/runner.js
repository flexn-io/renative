
import path from 'path';
import {
    IOS, TVOS, ANDROID, isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logDebug, logErrorPlatform,
} from './common';
import { executeAsync } from './exec';


const runApp = c => new Promise((resolve, reject) => {
    logTask('runApp');
    const { platform } = c;
    if (!isPlatformSupported(platform, resolve)) return;

    switch (platform) {
    case IOS:
        _runiOS(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
        break;
    }

    logErrorPlatform(platform, resolve);
});

const updateApp = c => new Promise((resolve, reject) => {
    const platform = c.platform;
    if (!isPlatformSupported(platform, resolve)) return;

    switch (platform) {
    case IOS:
        _runiOSUpdate(c)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
        break;
    }

    logErrorPlatform(c.platform, resolve);
});

const iosPlatforms = [IOS, TVOS];
const _runiOSUpdate = (c) => {
    logTask('_runiOSUpdate');
    if (iosPlatforms.includes(c.platform)) {
        return _runPod('update', getAppFolder(c, 'ios'));
    }

    return Promise().resolve();
};

const _runiOSInstall = (c) => {
    logTask('_runiOSInstall');

    return _runPod('install', getAppFolder(c, 'ios'));
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
    const appPath = getAppFolder(c);
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

export { runApp, updateApp };
