import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { IOS, ANDROID, TVOS, isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder } from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';


const configure = c => new Promise((resolve, reject) => {
    logTask('configure');
    _runConfigure(c)
        .then(() => {
            resolve();
        })
        .catch(e => reject(e));
});

const _runConfigure = c => new Promise((resolve, reject) => {
    logTask('_runConfigure');

    _runCopyRuntimeAssets(c)
        .then(() => _runCopyiOSAssets(c))
        .then(() => _runCopytvOSAssets(c))
        .then(() => _runConfigureAndroid(c))
        .then(() => _runCopyAndroidAssets(c))
        .then(() => resolve());
});


const _runCopyRuntimeAssets = c => new Promise((resolve, reject) => {
    logTask('_runCopyRuntimeAssets');
    const aPath = path.join(c.platformAssetsFolder, 'runtime');
    const cPath = path.join(c.appConfigFolder, 'assets/runtime');
    copyFolderContentsRecursiveSync(cPath, aPath);

    copyFileSync(c.appConfigPath, path.join(c.platformAssetsFolder, 'config.json'));
    resolve();
});

const _runCopyiOSAssets = c => new Promise((resolve, reject) => {
    logTask('_runCopyiOSAssets');
    if (!_isPlatformActive(c, IOS, resolve)) return;

    const iosPath = path.join(getAppFolder(c, IOS), 'RNVApp');
    const sPath = path.join(c.appConfigFolder, 'assets/ios');
    copyFolderContentsRecursiveSync(sPath, iosPath);
    resolve();
});

const _runCopytvOSAssets = c => new Promise((resolve, reject) => {
    logTask('_runCopytvOSAssets');
    if (!_isPlatformActive(c, TVOS, resolve)) return;

    const destPath = path.join(getAppFolder(c, TVOS), 'RNVAppTVOS');
    const sourcePath = path.join(c.appConfigFolder, 'assets/tvos');
    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const _runCopyAndroidAssets = c => new Promise((resolve, reject) => {
    logTask('_runCopyAndroidAssets');
    if (!_isPlatformActive(c, ANDROID, resolve)) return;

    const destPath = path.join(c.platformBuildsFolder, `${c.appId}_${ANDROID}/app/src/main/res`);
    const sourcePath = path.join(c.appConfigFolder, 'assets/android/res');
    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const _runConfigureAndroid = c => new Promise((resolve, reject) => {
    logTask('_runCopyAndroidAssets');
    if (!_isPlatformActive(c, ANDROID, resolve)) return;

    const appFolder = getAppFolder(c, ANDROID);

    copyFileSync(path.join(c.globalConfigFolder, 'local.properties'), path.join(appFolder, 'local.properties'));
    fs.chmodSync(path.join(appFolder, 'gradlew'), '755');

    resolve();
});


const _isPlatformActive = (c, platform, resolve) => {
    if (!c.appConfigFile.platforms[platform]) {
        console.log(`Platform ${platform} not configured for ${c.appId}. skipping.`);
        resolve();
        return false;
    }
    return true;
};

export { configure };
