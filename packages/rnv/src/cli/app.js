import path from 'path';
import fs from 'fs';
import {
    IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, WEB,
    isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, isPlatformActive,
} from '../common';
import { runPod, copyAppleAssets, configureXcodeProject } from '../platformTools/apple';
import { copyAndroidAssets, configureGradleProject } from '../platformTools/android';
import { copyTizenAssets, configureTizenProject } from '../platformTools/tizen';
import { copyWebOSAssets, configureWebOSProject } from '../platformTools/webos';
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

    _runCopyRuntimeAssets(c)
        .then(() => _runPlugins(c))
        .then(() => _runSetupAppleProject(c, IOS, 'RNVApp'))
        .then(() => _runSetupAppleProject(c, TVOS, 'RNVAppTVOS'))
        .then(() => _runSetupAndroidProject(c, ANDROID))
        .then(() => _runSetupAndroidProject(c, ANDROID_TV))
        .then(() => _runSetupAndroidProject(c, ANDROID_WEAR))
        .then(() => _runSetupTizenProject(c, TIZEN))
        .then(() => _runSetupWebOSProject(c, WEBOS))
        .then(() => _runSetupWebProject(c, WEB))
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
