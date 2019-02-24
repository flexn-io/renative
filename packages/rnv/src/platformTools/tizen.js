import path from 'path';
import fs from 'fs';
import { execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

function launchTizenSimulator(c, name) {
    logTask('launchTizenSimulator');

    if (name) {
        return execShellAsync(`em-cli launch --name ${name}`);
    }
    return Promise.reject('No simulator -t target name specified!');
}

const copyTizenAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyTizenAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const sourcePath = path.join(c.appConfigFolder, 'assets', platform);
    const destPath = path.join(getAppFolder(c, platform));

    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const configureTizenProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureTizenProject');


    resolve();
});

export { launchTizenSimulator, copyTizenAssets, configureTizenProject };
