import path from 'path';
import fs from 'fs';
import { executeAsync, execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';


const configureElectronProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureElectronProject');
    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);

    const packagePath = path.join(appFolder, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath));

    console.log('BLALALAAL', packageJson);

    packageJson.name = `${c.appConfigFile.common.title} - ${platform}`;
    packageJson.productName = `${c.appConfigFile.common.title} - ${platform}`;

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

    resolve();
});

export { configureElectronProject };
