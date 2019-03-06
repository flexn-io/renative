import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder } from '../common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator } from '../platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from '../platformTools/android';
import { launchKaiOSSimulator } from '../platformTools/kaios';


const CREATE = 'create';
const REMOVE = 'remove';
const LAUNCH = 'launch';
const QUIT = 'quit';
const LIST = 'list';


// ##########################################
// PUBLIC API
// ##########################################

const run = c => new Promise((resolve, reject) => {
    logTask('run');

    if (!isPlatformSupported(c.program.platform, null, reject)) return;

    switch (c.subCommand) {
    // case CREATE:
    //     return Promise.resolve();
    //     break;
    // case REMOVE:
    //     return Promise.resolve();
    //     break;
    case LAUNCH:
        _runLaunch(c).then(() => resolve()).catch(e => reject(e));
        return;
    // case QUIT:
    //     return Promise.resolve();
    //     break;
    case LIST:
        _runList(c).then(() => resolve()).catch(e => reject(e));
        return;
    default:
        return Promise.reject(`Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
    }
});


// ##########################################
// PRIVATE
// ##########################################

const _runLaunch = c => new Promise((resolve, reject) => {
    logTask('_runLaunch');
    const { platform, program } = c;
    const { target } = program;

    switch (platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        launchAndroidSimulator(c, target)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
        break;
    case TIZEN:
        launchTizenSimulator(c, target)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
        break;
    case WEBOS:
        launchWebOSimulator(c, target)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
        break;
    case KAIOS:
        launchKaiOSSimulator(c, target)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
        break;
    default:
        reject(`"target launch" command does not support ${chalk.white.bold(platform)} platform yet. You will have to launch the emulator manually. Working on it!`);
    }
});

const _runList = c => new Promise((resolve, reject) => {
    logTask('_runLaunch');
    const { platform, program } = c;
    const { target } = program;
    if (!isPlatformSupported(platform)) return;

    switch (platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        listAndroidTargets(c, target)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
        break;
    default:
        reject(`"target list" command does not support ${chalk.white.bold(platform)} platform yet. Working on it!`);
    }
});


export default run;
