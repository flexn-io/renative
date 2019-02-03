
import path from 'path';
import { IOS, TVOS, ANDROID, isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder, logDebug } from './common';
import { executeAsync } from './exec';


const runApp = (appId, program, process) => new Promise((resolve, reject) => {
    const platform = program.platform;
    if (!isPlatformSupported(platform, resolve)) return;

    switch (platform) {
    case IOS:
        getConfig(appId).then((v) => {
            _runiOS(v, platform, program)
                .then(() => resolve())
                .catch(e => reject(e));
        });
        return;
        break;
    }

    _logErrorPlatform(platform, resolve);
});

const updateApp = (appId, program, process) => new Promise((resolve, reject) => {
    const platform = program.platform;
    if (!isPlatformSupported(platform, resolve)) return;


    switch (platform) {
    case IOS:
        getConfig(appId).then((v) => {
            _runiOSUpdate(v)
                .then(() => resolve())
                .catch(e => reject(e));
        });
        return;
        break;
    }

    _logErrorPlatform(platform, resolve);
});

const _logErrorPlatform = (platform, resolve) => {
    console.log(`${platform} doesn't support this command`);
    resolve();
};

const iosPlatforms = [IOS, TVOS];
const _runiOSUpdate = (c, platform) => {
    logTask('_runiOSUpdate');
    if (iosPlatforms.includes(platform)) {
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

const _runiOS = (c, platform, program) => {
    logTask('_runiOS');
    console.log('KJKLJLKJ', program);
    const device = program.simulator || 'iPhone 6';
    const appPath = getAppFolder(c, platform);
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
