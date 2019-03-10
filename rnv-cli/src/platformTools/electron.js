import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import { executeAsync, execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive, configureIfRequired, getAppConfigId,
    getAppVersion, getAppTitle, getAppVersionCode, writeCleanFile, getAppId, getAppTemplateFolder,
    getEntryFile, getAppDescription, getAppAuthor, getAppLicense,
} from '../common';
import { buildWeb } from './web';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const configureElectronProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureElectronProject');

    configureIfRequired(c, platform)
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);

    const packagePath = path.join(appFolder, 'package.json');
    const pkgJson = path.join(getAppTemplateFolder(c, platform), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(pkgJson));

    packageJson.name = `${getAppConfigId(c, platform)}-${platform}`;
    packageJson.productName = `${getAppTitle(c, platform)} - ${platform}`;
    packageJson.version = `${getAppVersion(c, platform)}`;
    packageJson.description = `${getAppDescription(c, platform)}`;
    packageJson.author = `${getAppAuthor(c, platform)}`;
    packageJson.license = `${getAppLicense(c, platform)}`;

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

    resolve();
});

const runElectron = (c, platform) => new Promise((resolve, reject) => {
    logTask(`runElectron:${platform}`);

    const elc = path.resolve(c.nodeModulesFolder, 'electron/cli.js');

    const appFolder = getAppFolder(c, platform);
    buildWeb(c, platform)
        .then(() => shell.exec(`${elc} ${appFolder}`))
        .catch(e => reject(e));
});

export { configureElectronProject, runElectron };
