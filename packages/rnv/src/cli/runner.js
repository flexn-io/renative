
import path from 'path';
import shell from 'shelljs';
import {
    IOS, TVOS, ANDROID, WEB, TIZEN, isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logDebug, logErrorPlatform,
} from '../common';
import { executeAsync } from '../exec';
import { buildWeb } from '../platformTools/web';

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
    if (!isPlatformSupported(platform)) return;

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
    case TIZEN:
        _runTizen(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    logErrorPlatform(platform, resolve);
});

const _runTizen = c => new Promise((resolve, reject) => {
    logTask('_runTizen');

    const tDir = getAppFolder(c, TIZEN);
    const tOut = path.join(tDir, 'output');
    const tBuild = path.join(tDir, 'build');
    const tId = 'NvVRhWHJST.RNVanilla';
    const tSim = c.program.target || 'T-samsung-4.0-x86';
    const gwt = 'RNVanilla.wgt';

    buildWeb(c, TIZEN)
        .then(() => {
            shell.exec(`tizen build-web -- ${tDir} -out ${tBuild} && tizen package -- ${tBuild} -t wgt -o ${tOut} && tizen uninstall -p ${tId} -t ${tSim} && tizen install -- ${tOut} -n ${gwt} -t ${tSim}`, () => {
                shell.exec(`tizen run -p ${tId} -t ${tSim}`);
            });
        });
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
