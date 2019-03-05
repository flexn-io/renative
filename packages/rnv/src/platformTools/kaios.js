import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { execShellAsync, execCLI } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive, checkSdk, logWarning, configureIfRequired,
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

const configureKaiOSProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureKaiOSProject');

    configureIfRequired(c, platform)
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    resolve();
});

export { launchKaiOSSimulator, configureKaiOSProject };
