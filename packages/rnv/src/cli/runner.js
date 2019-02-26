import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
    IOS, TVOS, ANDROID, WEB, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, MACOS, WINDOWS,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
    isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logDebug, logErrorPlatform,
} from '../common';
import { executeAsync, execCLI } from '../exec';
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
        _runiOS(c).then(() => resolve()).catch(e => reject(e));
        return;
    case TVOS:
        _runtvOS(c).then(() => resolve()).catch(e => reject(e));
        return;
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        _runAndroid(c, platform, platform === ANDROID_WEAR)
            .then(() => resolve()).catch(e => reject(e));
        return;
    case MACOS:
    case WINDOWS:
        _runElectron(c, platform).then(() => resolve()).catch(e => reject(e));
        return;
    case WEB:
        _runWeb(c).then(() => resolve()).catch(e => reject(e));
        return;
    case TIZEN:
        _runTizen(c).then(() => resolve()).catch(e => reject(e));
        return;
    case WEBOS:
        _runWebOS(c).then(() => resolve()).catch(e => reject(e));
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
    const certProfile = 'RNVanilla';

    buildWeb(c, TIZEN)
        .then(() => execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`))
        .then(() => execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`))
        .then(() => execCLI(c, CLI_TIZEN, `uninstall -p ${tId} -t ${tSim}`))
        .then(() => execCLI(c, CLI_TIZEN, `install -- ${tOut} -n ${gwt} -t ${tSim}`))
        .then(() => execCLI(c, CLI_TIZEN, `run -p ${tId} -t ${tSim}`))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runWebOS = c => new Promise((resolve, reject) => {
    logTask('_runWebOS');

    const tDir = path.join(getAppFolder(c, WEBOS), 'public');
    const tOut = path.join(getAppFolder(c, WEBOS), 'output');
    const tSim = c.program.target || 'emulator';
    const configFilePath = path.join(getAppFolder(c, WEBOS), 'RNVApp/appinfo.json');

    const cnfg = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    const tId = cnfg.id;
    const appPath = path.join(tOut, `${tId}_${cnfg.version}_all.ipk`);

    buildWeb(c, WEBOS)
        .then(() => execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir}`))
        .then(() => execCLI(c, CLI_WEBBOS_ARES_INSTALL, `--device ${tSim} ${appPath}`))
        .then(() => execCLI(c, CLI_WEBBOS_ARES_LAUNCH, `--device ${tSim} ${tId}`))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runAndroid = (c, platform, forcePackage) => new Promise((resolve, reject) => {
    logTask(`_runAndroid:${platform}`);

    const appFolder = getAppFolder(c, platform);
    if (c.appConfigFile.platforms.android.runScheme === 'Release' || forcePackage) {
        _packageAndroid(c, platform).then(() => {
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

const _packageAndroid = (c, platform) => {
    logTask('_packageAndroid');

    const appFolder = getAppFolder(c, platform);
    return executeAsync('react-native', [
        'bundle',
        '--platform',
        'android',
        '--dev',
        'false',
        '--assets-dest',
        `${appFolder}/app/src/main/res`,
        '--entry-file',
        `${c.appConfigFile.platforms[platform].entryFile}.js`,
        '--bundle-output',
        `${appFolder}/app/src/main/assets/index.android.bundle`,
    ]);
};

const _runiOS = (c) => {
    logTask('_runiOS');
    const device = c.program.target || 'iPhone 6';
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
