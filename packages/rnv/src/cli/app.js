import path from 'path';
import fs from 'fs';
import {
    IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, WEB, MACOS, WINDOWS, TIZEN_WATCH,
    isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, isPlatformActive, logWarning, SUPPORTED_PLATFORMS,
} from '../common';
import { runPod, copyAppleAssets, configureXcodeProject } from '../platformTools/apple';
import { copyAndroidAssets, configureGradleProject, configureAndroidProperties } from '../platformTools/android';
import { copyTizenAssets, configureTizenProject, createDevelopTizenCertificate } from '../platformTools/tizen';
import { copyWebOSAssets, configureWebOSProject } from '../platformTools/webos';
import { configureElectronProject } from '../platformTools/electron';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import platformRunner from './platform';
import { getSupportedPlatformBuilders } from '../common';

const CONFIGURE = 'configure';
const SWITCH = 'switch';
const CREATE = 'create';
const REMOVE = 'remove';
const LIST = 'list';
const INFO = 'info';

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case CONFIGURE:
        return _runConfigure(c);
    case SWITCH:
        return Promise.resolve();
    case CREATE:
        return Promise.resolve();
    case REMOVE:
        return Promise.resolve();
    case LIST:
        return Promise.resolve();
    case INFO:
        return Promise.resolve();
    default:
        return Promise.reject(new Error(`Sub-Command ${c.subCommand} not supported`));
    }
};

// ##########################################
//  PRIVATE
// ##########################################

async function _runConfigure(config) {
    logTask('_runConfigure');
    return Promise.all(
        getSupportedPlatformBuilders().map(async (Platform) => {
            if (Platform) {
                const platform = new Platform();
                await platform.runSetupProject(config);
            }
            return Promise.resolve();
        }),
    );
    
    _runSetupGlobalSettings(config)
        .then(() => _checkAndCreatePlatforms(config))
        .then(() => copyRuntimeAssets(config))
        .then(() => _runPlugins(config))
        .then(() => _runSetupAppleProject(config, IOS, 'RNVApp'))
        .then(() => _runSetupAppleProject(config, TVOS, 'RNVAppTVOS'))
        .then(() => configureAndroidProperties(config))
        .then(() => _runSetupAndroidProject(config, ANDROID))
        .then(() => _runSetupAndroidProject(config, ANDROID_TV))
        .then(() => _runSetupAndroidProject(config, ANDROID_WEAR))
        .then(() => _runSetupTizenProject(config, TIZEN))
        .then(() => _runSetupTizenProject(config, TIZEN_WATCH))
        .then(() => _runSetupWebOSProject(config, WEBOS))
        .then(() => _runSetupWebProject(config, WEB))
        .then(() => _runSetupElectronProject(config, MACOS))
        .then(() => _runSetupElectronProject(config, WINDOWS))
        .then(() => resolve())
        .catch(e => reject(e));
};


const _runSetupAppleProject = (c, platform, appFolder) => new Promise((resolve, reject) => {
    logTask(`_runSetupAppleProject:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    runPod(c.program.update ? 'update' : 'install', getAppFolder(c, platform))
        .then(() => copyAppleAssets(c, platform, appFolder))
        .then(() => configureXcodeProject(c, platform, appFolder))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runSetupAndroidProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_runSetupAndroidProject:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    copyAndroidAssets(c, platform)
        .then(() => configureGradleProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runSetupTizenProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_runSetupTizenProject:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    copyTizenAssets(c, platform)
        .then(() => configureTizenProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runSetupWebOSProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_runSetupWebOSProject:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    copyWebOSAssets(c, platform)
        .then(() => configureWebOSProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runSetupWebProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_runSetupWebProject:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    resolve();
});

const _runSetupElectronProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_runSetupElectronProject:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    configureElectronProject(c, platform)
        .then(() => resolve())
        .catch(e => reject(e));

    resolve();
});

const _runSetupGlobalSettings = c => new Promise((resolve, reject) => {
    logTask('_runSetupGlobalSettings');

    if (isPlatformActive(c, TIZEN)) {
        const tizenAuthorCert = path.join(c.globalConfigFolder, 'tizen_author.p12');
        if (fs.existsSync(tizenAuthorCert)) {
            console.log('tizen_author.p12 file exists!');
            resolve();
        } else {
            console.log('tizen_author.p12 file missing! Creating one for you...');
            createDevelopTizenCertificate(c).then(() => resolve()).catch(e => reject(e));
        }
    }
});

const _checkAndCreatePlatforms = c => new Promise((resolve, reject) => {
    logTask('_checkAndCreatePlatforms');

    if (!fs.existsSync(c.platformBuildsFolder)) {
        logWarning('Platforms not created yet. creating them for you...');

        const newCommand = Object.assign({}, c);
        newCommand.subCommand = 'configure';
        newCommand.program = { appConfig: 'helloWorld' };

        platformRunner(newCommand)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    resolve();
});

const copyRuntimeAssets = c => new Promise((resolve, reject) => {
    logTask('copyRuntimeAssets');
    const aPath = path.join(c.platformAssetsFolder, 'runtime');
    const cPath = path.join(c.appConfigFolder, 'assets/runtime');
    copyFolderContentsRecursiveSync(cPath, aPath);

    copyFileSync(c.appConfigPath, path.join(c.platformAssetsFolder, 'config.json'));
    resolve();
});


const _runPlugins = c => new Promise((resolve, reject) => {
    logTask('_runPlugins');

    const pluginsPath = path.resolve(c.rnvFolder, 'plugins');

    fs.readdirSync(pluginsPath).forEach((dir) => {
        const pp = path.resolve(pluginsPath, dir, 'overrides');
        fs.readdirSync(pp).forEach((file) => {
            copyFileSync(path.resolve(pp, file), path.resolve(c.projectRootFolder, 'node_modules', dir));
        });
    });
    resolve();
});

export { copyRuntimeAssets };

export default run;
