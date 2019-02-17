import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { IOS, ANDROID, TVOS, isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder } from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';


// ##########################################
// PUBLIC API
// ##########################################

const run = c => new Promise((resolve, reject) => {
    logTask('run');

    resolve();
});

const _createPlatforms = c => new Promise((resolve, reject) => {
    logTask('_createPlatforms');
    _runCreatePlatforms(c)
        .then(() => {
            resolve();
        })
        .catch(e => reject(e));
});


const _addPlatform = (platform, program, process) => new Promise((resolve, reject) => {
    if (!isPlatformSupported(platform)) return;

    getConfig().then((v) => {
        _runAddPlatform()
            .then(() => resolve())
            .catch(e => reject(e));
    });
});

const _removePlatform = (platform, program, process) => new Promise((resolve, reject) => {
    if (!isPlatformSupported(platform)) return;
    console.log('REMOVE_PLATFORM: ', platform);
    resolve();
});

// ##########################################
// PRIVATE
// ##########################################

const _runCreatePlatforms = c => new Promise((resolve, reject) => {
    logTask('_runCreatePlatforms');

    _runCleanPlaformFolders(c)
        .then(() => _runCleanPlaformAssets(c))
        .then(() => _runCopyPlatforms(c))
        .then(() => resolve());
});

const _runCleanPlaformAssets = c => new Promise((resolve, reject) => {
    logTask('_runCleanPlaformAssets');

    cleanFolder(c.platformAssetsFolder).then(() => {
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

const _runAddPlatform = c => new Promise((resolve, reject) => {
    logTask('runAddPlatform');
    resolve();
});

export default run;
