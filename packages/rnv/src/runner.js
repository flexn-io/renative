
import path from 'path';
import { isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder, logDebug } from './common';
import { executeAsync } from './exec';


const runApp = (appId, program, process) => new Promise((resolve, reject) => {
    const platform = program.platform;
    if (!isPlatformSupported(platform)) return;
    // console.log('RUN: ', appId, platform, program.device);

    getConfig(appId).then((v) => {
        _runiOS(v, platform)
            .then(() => resolve())
            .catch(e => reject(e));
    });
});

const updateApp = (appId, program, process) => new Promise((resolve, reject) => {
    const platform = program.platform;
    if (!isPlatformSupported(platform)) return;
    // console.log('RUN: ', appId, platform, program.device);

    getConfig(appId).then((v) => {
        _runiOSUpdate(v)
            .then(() => resolve())
            .catch(e => reject(e));
    });
});

const _runiOSUpdate = (c) => {
    logTask('_runiOSUpdate');

    return _runPod('update', getAppFolder(c, 'ios'));
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

const _runiOS = (c, platform) => {
    logTask('_runiOS');
    const device = 'iPhone 6';
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
