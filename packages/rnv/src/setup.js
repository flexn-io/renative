import chalk from 'chalk';
import path from 'path';
import { isPlatformSupported, getConfig, logTask, logComplete, logError } from './common';
import { cleanFolder, copyFolderContentsRecursiveSync } from './fileutils';

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
        .then(() => _runCopyPlatforms(c))
        .then(() => _runCopyAssets(c))
        .then(() => resolve());
});

const _runCleanPlaformFolders = c => new Promise((resolve, reject) => {
    logTask('_runCleanPlaformFolders');

    const cleanTasks = [];

    for (const k in c.appConfigFile.platforms) {
        if (isPlatformSupported(k)) {
            const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
            const ptPath = path.join(c.platformTemplatesFolder, `${k}`);
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

const _runCopyAssets = c => new Promise((resolve, reject) => {
    logTask('_runCopyAssets');
    const aPath = c.platformAssetsFolder;
    const cPath = c.appConfigFolder;
    copyFolderContentsRecursiveSync(cPath, aPath);
    resolve();
});

export { createPlatforms };
