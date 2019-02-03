import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { IOS, ANDROID, isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder } from './common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from './fileutils';

const createPlatforms = c => new Promise((resolve, reject) => {
    logTask('createPlatforms');
    _runCreatePlatforms(c)
        .then(() => {
            resolve();
        })
        .catch(e => reject(e));
});

const _runCreatePlatforms = c => new Promise((resolve, reject) => {
    logTask('_runCreatePlatforms');

    _runCleanPlaformFolders(c)
        .then(() => _runCleanPlaformAssets(c))
        .then(() => _runCopyPlatforms(c))
        .then(() => _runCopyRuntimeAssets(c))
        .then(() => _runCopyiOSAssets(c))
        .then(() => _runConfigureAndroid(c))
        .then(() => _runCopyAndroidAssets(c))
        .then(() => resolve());
});

const _runCleanPlaformAssets = c => new Promise((resolve, reject) => {
    logTask('_runCleanPlaformAssets');

    cleanFolder(c.platformAssetsFolder).then(() => {
        resolve();
    });
});

const _runCleanPlaformFolders = c => new Promise((resolve, reject) => {
    logTask('_runCleanPlaformFolders');

    const cleanTasks = [];

    for (const k in c.appConfigFile.platforms) {
        if (isPlatformSupported(k)) {
            const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
            cleanTasks.push(cleanFolder(pPath));
        }
    }

    Promise.all(cleanTasks).then((values) => {
        resolve();
    });
});

const _runCopyPlatforms = c => new Promise((resolve, reject) => {
    logTask('_runCopyPlatforms');
    const copyPlatformTasks = [];
    for (const k in c.appConfigFile.platforms) {
        if (isPlatformSupported(k)) {
            const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
            const ptPath = path.join(c.platformTemplatesFolder, `${k}`);
            copyPlatformTasks.push(copyFolderContentsRecursiveSync(ptPath, pPath));
        }
    }

    Promise.all(copyPlatformTasks).then((values) => {
        resolve();
    });
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

    const iosPath = path.join(c.platformBuildsFolder, `${c.appId}_ios/RNVApp`);
    const sPath = path.join(c.appConfigFolder, 'assets/ios');
    copyFolderContentsRecursiveSync(sPath, iosPath);
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

export { createPlatforms };
