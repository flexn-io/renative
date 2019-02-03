import chalk from 'chalk';
import path from 'path';
import { isPlatformSupported, getConfig, logTask, logComplete, logError } from './common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from './fileutils';

const createPlatforms = (configName, program, process) => new Promise((resolve, reject) => {
    getConfig(configName).then((v) => {
        _runCreateApp(v)
            .then(() => {
                resolve();
            })
            .catch(e => reject(e));
    });
});

const _runCreateApp = c => new Promise((resolve, reject) => {
    logTask('_runCreateApp');
    // console.log('CONFIGIS:', c);
    _runCleanPlaformFolders(c)
        .then(() => _runCleanPlaformAssets(c))
        .then(() => _runCopyPlatforms(c))
        .then(() => _runCopyRuntimeAssets(c))
        .then(() => _runCopyiOSAssets(c))
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
    const iosPath = path.join(c.platformBuildsFolder, `${c.appId}_ios/RNVApp`);
    const sPath = path.join(c.appConfigFolder, 'assets/ios');
    copyFolderContentsRecursiveSync(sPath, iosPath);
    resolve();
});

export { createPlatforms };
