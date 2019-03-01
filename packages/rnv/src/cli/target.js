import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import {
    IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR,
    isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator } from '../platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from '../platformTools/android';


const CREATE = 'create';
const REMOVE = 'remove';
const LAUNCH = 'launch';
const QUIT = 'quit';
const LIST = 'list';


// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case CREATE:
        return Promise.resolve();
        break;
    case REMOVE:
        return Promise.resolve();
        break;
    case LAUNCH:
        return _runLaunch(c);
        break;
    case QUIT:
        return Promise.resolve();
        break;
    case LIST:
        return _runList(c);
        break;
    default:
        return Promise.reject(`Sub-Command ${c.subCommand} not supported`);
    }
};


// ##########################################
// PRIVATE
// ##########################################

const _runLaunch = c => new Promise((resolve, reject) => {
    logTask('_runLaunch');
    const { platform, program } = c;
    const { target } = program;
    if (!isPlatformSupported(platform, null, reject)) return;

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
    default:
        reject(`target launch does not support ${platform} yet!`);
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
        reject(`target launch does not support ${platform} yet!`);
    }
});


export default run;
