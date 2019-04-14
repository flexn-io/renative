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

const RUN = 'run';
const LIST = 'list';


// ##########################################
// PUBLIC API
// ##########################################

const run = c => new Promise((resolve, reject) => {
    logTask('run');

    switch (c.subCommand) {
    case RUN:
        _runHook(c).then(() => resolve()).catch(e => reject(e));
        return;
    case LIST:
        _listHooks(c).then(() => resolve()).catch(e => reject(e));
        return;
    default:
        return Promise.reject(`Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
    }
});


// ##########################################
// PRIVATE
// ##########################################

const _runHook = c => new Promise((resolve, reject) => {
    logTask('_runHook');
    const { platform, program } = c;

    const hooksFolder = path.join(c.projectRootFolder, 'buildHooks');
    const hooksDistFolder = path.join(hooksFolder, 'dist');
    const hookConfigPath = path.join(c.projectRootFolder, 'buildHooks/index.js');
    const hookConfigDistPath = path.join(c.projectRootFolder, 'buildHooks/dist/index.js');

    if (fs.existsSync(hookConfigPath)) {
        const babel = path.resolve(c.nodeModulesFolder, '.bin/babel');
        executeAsync(babel, [hooksFolder, '-d', hooksDistFolder])
            .then(() => {
                const hookConfig = require(hookConfigDistPath).default;
                if (hookConfig[c.program.exeMethod]) {
                    hookConfig[c.program.exeMethod]().then(() => resolve()).catch(e => reject());
                } else {
                    reject(`Method name ${chalk.white(c.program.exeMethod)} does not exists in your buildHooks!`);
                }
            }).catch((e) => {
                reject(e);
            });
    }
});

const _listHooks = c => new Promise((resolve, reject) => {
    logTask('_listHooks');
    const { platform, program } = c;

    resolve();
});


export default run;
