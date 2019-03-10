import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { execShellAsync, execCLI } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive, configureIfRequired, getAppConfigId,
    getAppVersion, getAppTitle, getAppVersionCode, writeCleanFile, getAppId, getAppTemplateFolder,
    getEntryFile, getAppDescription, getAppAuthor, getAppLicense,
} from '../common';
import {
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES, CLI_KAIOS_EMULATOR,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
    KAIOS_SDK,
} from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import { buildWeb } from './web';


const launchKaiOSSimulator = (c, name) => new Promise((resolve, reject) => {
    logTask('launchKaiOSSimulator');

    if (!c.globalConfig.sdks.KAIOS_SDK) {
        reject(`${KAIOS_SDK} is not configured in your ~/.rnv/config.json file. Make sure you add location to your Kaiosrt App path similar to: ${chalk.white.bold('"KAIOS_SDK": "/Applications/Kaiosrt.app"')}`);
        return;
    }

    const ePath = path.join(c.globalConfig.sdks.KAIOS_SDK);

    if (!fs.existsSync(ePath)) {
        reject(`Can't find emulator at path: ${ePath}`);
        return;
    }

    const childProcess = require('child_process');
    childProcess.exec(`open ${ePath}`, (err, stdout, stderr) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});

const copyKaiOSAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyKaiOSAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const sourcePath = path.join(c.appConfigFolder, 'assets', platform);
    const destPath = path.join(getAppFolder(c, platform));

    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const configureKaiOSProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureKaiOSProject');

    if (!isPlatformActive(c, platform, resolve)) return;

    configureIfRequired(c, platform)
        .then(() => copyKaiOSAssets(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);

    const manifestFilePath = path.join(getAppTemplateFolder(c, platform), 'manifest.webapp');
    const manifestFilePath2 = path.join(appFolder, 'manifest.webapp');
    const manifestFile = JSON.parse(fs.readFileSync(manifestFilePath));

    manifestFile.name = `${getAppConfigId(c, platform)}-${platform}`;
    manifestFile.description = `${getAppDescription(c, platform)}`;
    manifestFile.developer = getAppAuthor(c, platform);

    fs.writeFileSync(manifestFilePath2, JSON.stringify(manifestFile, null, 2));

    resolve();
});

const runKaiOS = (c, platform) => new Promise((resolve, reject) => {
    logTask(`runKaiOS:${platform}`);

    buildWeb(c, platform)
        .then(() => launchKaiOSSimulator(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

export { launchKaiOSSimulator, configureKaiOSProject, runKaiOS };
