import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { IOS, ANDROID, TVOS, TIZEN, isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder } from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';

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
        return Promise.resolve();
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
    if (!isPlatformSupported(platform)) return;

    switch (platform) {
    case TIZEN:
        launchTizenSimulator(c, target)
            .then(() => {
                resolve();
            })
            .catch(e => logError(e));
    }
});


export default run;
