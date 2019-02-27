import path from 'path';
import fs from 'fs';
import {
    IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, WEB, MACOS, WINDOWS,
    isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, isPlatformActive,
} from '../common';
import { runPod, copyAppleAssets, configureXcodeProject } from '../platformTools/apple';
import { copyAndroidAssets, configureGradleProject } from '../platformTools/android';
import { copyTizenAssets, configureTizenProject, createDevelopTizenCertificate } from '../platformTools/tizen';
import { copyWebOSAssets, configureWebOSProject } from '../platformTools/webos';
import { configureElectronProject } from '../platformTools/electron';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

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
        break;
    case SWITCH:
        return Promise.resolve();
        break;
    case CREATE:
        return Promise.resolve();
        break;
    case REMOVE:
        return Promise.resolve();
        break;
    case LIST:
        return Promise.resolve();
        break;
    case INFO:
        return Promise.resolve();
        break;
    default:
        return Promise.reject(`Sub-Command ${c.subCommand} not supported`);
    }
};

// ##########################################
//  PRIVATE
// ##########################################

const _runConfigure = c => new Promise((resolve, reject) => {
    logTask('_runConfigure');

    _runSetupGlobalSettings(c)
        .then(() => _runCopyRuntimeAssets(c))
        .then(() => _runPlugins(c))
        .then(() => _runSetupAppleProject(c, IOS, 'RNVApp'))
        .then(() => _runSetupAppleProject(c, TVOS, 'RNVAppTVOS'))
        .then(() => _runSetupAndroidProject(c, ANDROID))
        .then(() => _runSetupAndroidProject(c, ANDROID_TV))
        .then(() => _runSetupAndroidProject(c, ANDROID_WEAR))
        .then(() => _runSetupTizenProject(c, TIZEN))
        .then(() => _runSetupWebOSProject(c, WEBOS))
        .then(() => _runSetupWebProject(c, WEB))
        .then(() => _runSetupElectronProject(c, MACOS))
        .then(() => _runSetupElectronProject(c, WINDOWS))
        .then(() => resolve());
});


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

    const localProperties = path.join(c.globalConfigFolder, 'local.properties');
    if (fs.existsSync(localProperties)) {
        console.log('local.properties file exists!');
    } else {
        console.log('local.properties file missing! Creating one for you...');
    }

    fs.writeFileSync(localProperties, `#Generated by RNV
ndk.dir=${c.rnvHomeConfig.sdks.ANDROID_NDK}
sdk.dir=${c.rnvHomeConfig.sdks.ANDROID_SDK}`);

    if (isPlatformActive(c, TIZEN)) {
        const tizenAuthorCert = path.join(c.globalConfigFolder, 'tizen_author.p12');
        if (fs.existsSync(tizenAuthorCert)) {
            console.log('tizen_author.p12 file exists!');
            resolve();
        } else {
            console.log('tizen_author.p12 file missing! Creating one for you...');
            createDevelopTizenCertificate(c).then(() => resolve()).catch(reject());
        }
    }
});

const _runCopyRuntimeAssets = c => new Promise((resolve, reject) => {
    logTask('_runCopyRuntimeAssets');
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

export default run;
