import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder,
    logWarning,
} from '../common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { executeAsync, execShellAsync, execCLI } from '../exec';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator } from '../platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from '../platformTools/android';
import { listAppleDevices, launchAppleSimulator } from '../platformTools/apple';
import { launchKaiOSSimulator } from '../platformTools/kaios';


// ##########################################
// PUBLIC API
// ##########################################

const executeHook = c => new Promise((resolve, reject) => {
    logTask('executeHook');
    const { platform, program } = c;

    buildHooks(c).then(() => {
        if (c.buildHooks[c.program.exeMethod]) {
            c.buildHooks[c.program.exeMethod]().then(() => resolve()).catch(e => reject());
        } else {
            reject(`Method name ${chalk.white(c.program.exeMethod)} does not exists in your buildHooks!`);
        }
    }).catch(e => reject(e));
});

const buildHooks = c => new Promise((resolve, reject) => {
    logTask('buildHooks');
    if (fs.existsSync(c.buildHooksIndexPath) && !c.isBuildHooksReady) {
        const babel = path.resolve(c.nodeModulesFolder, '.bin/babel');
        executeAsync(babel, [c.buildHooksFolder, '-d', c.buildHooksDistFolder])
            .then(() => {
                const h = require(c.buildHooksDistIndexPath);
                c.buildHooks = h.default;
                c.buildHooksConfig = h.hooks;
                c.isBuildHooksReady = true;
                resolve();
            }).catch((e) => {
                reject(e);
            });
    } else {
        logWarning(`Your buildHook ${chalk.white(c.buildHooksIndexPath)} is missing!. Skipping operation`);
    }
});

const listHooks = c => new Promise((resolve, reject) => {
    logTask('_listHooks');
    const { platform, program } = c;

    buildHooks(c).then(() => {
        let hooksAsString = '\n';
        if (c.buildHooks) {
            let i = 1;
            for (const k in c.buildHooks) {
                hooksAsString += `-[${i}] ${chalk.white(k)}`;
                i++;
            }
            console.log(hooksAsString);
            resolve();
        } else {
            reject('Your buildHooks object is empty!');
        }
    }).catch(e => reject(e));
});


export { buildHooks, listHooks, executeHook };
