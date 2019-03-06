import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import { execShellAsync, executeAsync, execCLI } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive, logWarning, configureIfRequired,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import { buildWeb } from './web';

const launchWebOSimulator = (c, name) => new Promise((resolve, reject) => {
    logTask('launchWebOSimulator');

    const ePath = path.join(c.globalConfig.sdks.WEBOS_SDK, 'Emulator/v4.0.0/LG_webOS_TV_Emulator_RCU.app');

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

const copyWebOSAssets = (c, platform) => new Promise((resolve, reject) => {
    logTask('copyWebOSAssets');
    if (!isPlatformActive(c, platform, resolve)) return;

    const sourcePath = path.join(c.appConfigFolder, 'assets', platform);
    const destPath = path.join(getAppFolder(c, platform), 'RNVApp');

    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const runWebOS = (c, platform) => new Promise((resolve, reject) => {
    logTask(`runWebOS:${platform}`);

    const tDir = path.join(getAppFolder(c, platform), 'public');
    const tOut = path.join(getAppFolder(c, platform), 'output');
    const tSim = c.program.target || 'emulator';
    const configFilePath = path.join(getAppFolder(c, platform), 'RNVApp/appinfo.json');

    const cnfg = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    const tId = cnfg.id;
    const appPath = path.join(tOut, `${tId}_${cnfg.version}_all.ipk`);

    buildWeb(c, platform)
        .then(() => execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir}`, logTask))
        .then(() => execCLI(c, CLI_WEBBOS_ARES_INSTALL, `--device ${tSim} ${appPath}`, logTask))
        .then(() => execCLI(c, CLI_WEBBOS_ARES_LAUNCH, `--device ${tSim} ${tId}`, logTask))
        .then(() => resolve())
        .catch((e) => {
            if (e && e.includes(CLI_WEBBOS_ARES_INSTALL)) {
                logWarning(`Looks like there is no emulator or device connected! Try launch one first! "${
                    chalk.white.bold('npx rnv target launch -p webos -t emulator')}"`);
                // const newCommand = Object.assign({}, c);
                // c.subCommand = 'launch';
                // c.program = { target: 'emulator' };
                // launchWebOSimulator(newCommand)
                //     .then(() => execCLI(c, CLI_WEBBOS_ARES_INSTALL, `--device ${tSim} ${appPath}`, logTask))
                //     .then(() => execCLI(c, CLI_WEBBOS_ARES_LAUNCH, `--device ${tSim} ${tId}`, logTask))
                //     .then(() => resolve())
                //     .catch(e => reject(e));
                reject(e);
            } else {
                reject(e);
            }
        });
});


const configureWebOSProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureWebOSProject');

    if (!isPlatformActive(c, platform, resolve)) return;

    configureIfRequired(c, platform)
        .then(() => copyWebOSAssets(c, platform))
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform, appFolderName) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    resolve();
});

export { launchWebOSimulator, copyWebOSAssets, configureWebOSProject, runWebOS };
