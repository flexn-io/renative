import path from 'path';
import fs from 'fs';
import { execShellAsync, execCLI } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';


function launchTizenSimulator(c, name) {
    logTask('launchTizenSimulator');

    if (name) {
        return execCLI(c, CLI_TIZEN_EMULATOR, `launch --name ${name}`);
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

const createDevelopTizenCertificate = (c) => {
    logTask('createDevelopTizenCertificate');

    return execCLI(c, CLI_TIZEN, 'certificate -- ~/.rnv -a rnv -f tizen_author -p 1234')
        .then(() => execCLI(c, CLI_TIZEN, 'security-profiles add -n RNVanillaCert -a ~/.rnv/tizen_author.p12 -p 1234'));
};

export { launchTizenSimulator, copyTizenAssets, configureTizenProject, createDevelopTizenCertificate };
