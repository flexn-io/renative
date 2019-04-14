import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import { isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder } from '../common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { executeAsync, execShellAsync, execCLI } from '../exec';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator } from '../platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from '../platformTools/android';
import { listAppleDevices, launchAppleSimulator } from '../platformTools/apple';
import { launchKaiOSSimulator } from '../platformTools/kaios';
import { buildHooks, listHooks, executeHook } from '../platformTools/node';

const RUN = 'run';
const LIST = 'list';


// ##########################################
// PUBLIC API
// ##########################################

const run = c => new Promise((resolve, reject) => {
    logTask('run');

    switch (c.subCommand) {
    case RUN:
        executeHook(c).then(() => resolve()).catch(e => reject(e));
        return;
    case LIST:
        listHooks(c).then(() => resolve()).catch(e => reject(e));
        return;
    default:
        return Promise.reject(`Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
    }
});


// ##########################################
// PRIVATE
// ##########################################


export default run;
