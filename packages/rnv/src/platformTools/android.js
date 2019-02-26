import path from 'path';
import fs from 'fs';
import { executeAsync, execShellAsync, execCLI } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';


function launchAndroidSimulator(c, name) {
    logTask('launchAndroidSimulator');

    if (name) {
        return execCLI(c, CLI_ANDROID_EMULATOR, `-avd "${name}"`);
    }
    return Promise.reject('No simulator -t target name specified!');
}

function listAndroidTargets(c) {
    logTask('listAndroidTargets');

    return execCLI(c, CLI_ANDROID_ADB, 'devices -l');
}


const copyAndroidAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyAndroidAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const destPath = path.join(getAppFolder(c, platform), 'app/src/main/res');
    const sourcePath = path.join(c.appConfigFolder, `assets/${platform}/res`);
    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const configureGradleProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureGradleProject');
    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);

    copyFileSync(path.join(c.globalConfigFolder, 'local.properties'), path.join(appFolder, 'local.properties'));
    mkdirSync(path.join(appFolder, 'app/src/main/assets'));
    fs.writeFileSync(path.join(appFolder, 'app/src/main/assets/index.android.bundle'), '{}');
    fs.chmodSync(path.join(appFolder, 'gradlew'), '755');

    resolve();
});

export { copyAndroidAssets, configureGradleProject, launchAndroidSimulator, listAndroidTargets };
