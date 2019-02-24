import path from 'path';
import fs from 'fs';
import { executeAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const copyAndroidAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyAndroidAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const destPath = path.join(getAppFolder(c, platform), 'app/src/main/res');
    const sourcePath = path.join(c.appConfigFolder, 'assets/android/res');
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

export { copyAndroidAssets, configureGradleProject };
