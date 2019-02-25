import path from 'path';
import fs from 'fs';
import { executeAsync, execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';


function launchAndroidSimulator(c, name) {
    logTask('launchAndroidSimulator');

    const em = path.join(c.homeFolder, 'Library/Android/sdk/tools/emulator');

    if (name) {
        return execShellAsync(`${em} -avd "${name}"`);
    }
    return Promise.reject('No simulator -t target name specified!');
}

function listAndroidTargets(c) {
    logTask('listAndroidDevices');

    const em = path.join(c.homeFolder, 'Library/Android/sdk/tools/adb');
    return execShellAsync(`${em} devices -l`);
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

export { copyAndroidAssets, configureGradleProject, launchAndroidSimulator };
