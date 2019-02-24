import path from 'path';
import fs from 'fs';
import {
    IOS, ANDROID, TVOS, isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, isPlatformActive,
} from '../common';
import { runPod, copyAppleAssets, configureXcodeProject } from '../platformTools/apple';
import { copyAndroidAssets, configureGradleProject } from '../platformTools/android';
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
        .then(() => _runSetupIOSProject(c))
        .then(() => _runSetupAndroidProject(c))
        .then(() => _runSetupTVOSProject(c))
        .then(() => resolve());
});


const _runSetupIOSProject = c => new Promise((resolve, reject) => {
    logTask('_runSetupIOSProject');
    if (!isPlatformActive(c, IOS, resolve)) return;

    runPod('install', getAppFolder(c, IOS))
        .then(() => copyAppleAssets(c, IOS, 'RNVApp'))
        .then(() => configureXcodeProject(c, IOS, 'RNVApp'))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runSetupTVOSProject = c => new Promise((resolve, reject) => {
    logTask('_runSetupTVOSProject');
    if (!isPlatformActive(c, TVOS, resolve)) return;

    runPod('install', getAppFolder(c, TVOS))
        .then(() => copyAppleAssets(c, TVOS, 'RNVAppTVOS'))
        .then(() => configureXcodeProject(c, TVOS, 'RNVAppTVOS'))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runSetupAndroidProject = c => new Promise((resolve, reject) => {
    logTask('_runSetupAndroidProject');
    if (!isPlatformActive(c, ANDROID, resolve)) return;

    copyAndroidAssets(c)
        .then(() => configureGradleProject(c))
        .then(() => resolve())
        .catch(e => reject(e));
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
