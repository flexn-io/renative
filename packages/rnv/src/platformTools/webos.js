import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import { execShellAsync, executeAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const launchWebOSimulator = (c, name) => new Promise((resolve, reject) => {
    logTask('launchWebOSimulator');

    const homedir = require('os').homedir();

    const ePath = path.join(c.globalConfig.sdks.WEBOS_SDK, 'Emulator/v4.0.0/LG_webOS_TV_Emulator_RCU.app');

    // shell.exec(ePath);

    // executeAsync(ePath, []);


    const childProcess = require('child_process');
    childProcess.exec(`open ${ePath}`, (err, stdout, stderr) => {
        if (err) {
            // console.error(err);
            reject(err);
            return;
        }
        // console.log(stdout);
        process.exit(0);// exit process once it is opened
        resolve(stdout);
    });

    // return Promise.reject('Not supported yet');
});

const copyWebOSAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyWebOSAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const sourcePath = path.join(c.appConfigFolder, 'assets', platform);
    const destPath = path.join(getAppFolder(c, platform), 'RNVApp');

    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const configureWebOSProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureWebOSProject');


    resolve();
});

export { launchWebOSimulator, copyWebOSAssets, configureWebOSProject };
