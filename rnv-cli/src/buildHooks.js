import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder,
    logWarning,
} from './common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from './constants';
import { executeAsync, execShellAsync, execCLI } from './exec';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from './fileutils';
import { launchTizenSimulator } from './platformTools/tizen';
import { launchWebOSimulator } from './platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from './platformTools/android';
import { listAppleDevices, launchAppleSimulator } from './platformTools/apple';
import { launchKaiOSSimulator } from './platformTools/kaios';
import { PIPES as RUNNER_PIPES } from './cli/runner';
import { PIPES as PLATFORM_PIPES } from './cli/platform';
import { PIPES as PLUGIN_PIPES } from './cli/plugin';
import { PIPES as TARGET_PIPES } from './cli/target';
import { PIPES as APP_PIPES } from './cli/app';

const PIPES = { ...RUNNER_PIPES, ...PLATFORM_PIPES, ...PLUGIN_PIPES, ...TARGET_PIPES, ...APP_PIPES };

// ##########################################
// PUBLIC API
// ##########################################

const executeHook = c => new Promise((resolve, reject) => {
    logTask('executeHook');

    buildHooks(c).then(() => {
        if (c.buildHooks[c.program.exeMethod]) {
            c.buildHooks[c.program.exeMethod](c).then(() => resolve()).catch(e => reject(e));
        } else {
            reject(`Method name ${chalk.white(c.program.exeMethod)} does not exists in your buildHooks!`);
        }
    }).catch(e => reject(e));
});

const executePipe = (c, key) => new Promise((resolve, reject) => {
    logTask(`executePipe:${key}`);

    buildHooks(c).then(() => {
        const pipe = c.buildPipes ? c.buildPipes[key] : null;

        if (Array.isArray(pipe)) {
            const chain = pipe.reduce((accumulatorPromise, next) => accumulatorPromise.then(() => next(c)), Promise.resolve()).then(() => resolve()).catch(e => reject(e));
            return;
        } if (pipe) {
            c.buildPipes[key](c).then(() => resolve()).catch(e => reject(e));
            return;
        }

        resolve();
    }).catch(e => reject(e));
});

const buildHooks = c => new Promise((resolve, reject) => {
    logTask('buildHooks');
    if (fs.existsSync(c.buildHooksIndexPath)) {
        if (c.isBuildHooksReady) {
            resolve();
            return;
        }
        // const babel = path.resolve(c.nodeModulesFolder, '.bin/babel');
        const babel = path.resolve(c.nodeModulesFolder, '@babel/cli/bin/babel.js');
        executeAsync(babel, ['--no-babelrc', c.buildHooksFolder, '-d', c.buildHooksDistFolder, '--presets=@babel/env'])
            .then(() => {
                const h = require(c.buildHooksDistIndexPath);
                c.buildHooks = h.hooks;
                c.buildPipes = h.pipes;
                c.isBuildHooksReady = true;
                resolve();
            }).catch((e) => {
                console.log(e);
                resolve();
            });
    } else {
        logWarning(`Your buildHook ${chalk.white(c.buildHooksIndexPath)} is missing!. Skipping operation`);
        resolve();
    }
});

const listHooks = c => new Promise((resolve, reject) => {
    logTask('listHooks');

    buildHooks(c).then(() => {
        let hooksAsString = `\n${chalk.blue('Hooks:')}\n`;
        if (c.buildHooks) {
            let i = 1;
            for (const k in c.buildHooks) {
                hooksAsString += `-[${i}] ${chalk.white(k)}\n`;
                i++;
            }
            if (c.buildPipes) {
                hooksAsString += `\n${chalk.blue('Pipes:')}\n`;
                i = 1;
                for (const k in c.buildPipes) {
                    hooksAsString += `-[${i}] ${chalk.white(k)}\n`;
                    i++;
                }
            }
            console.log(hooksAsString);
            resolve();
        } else {
            reject('Your buildHooks object is empty!');
        }
    }).catch(e => reject(e));
});

const listPipes = c => new Promise((resolve, reject) => {
    logTask('listPipes');

    let pipesAsString = '\n';
    let i = 1;
    for (const k in PIPES) {
        pipesAsString += `-[${i}] ${chalk.white(PIPES[k])}\n`;
        i++;
    }
    console.log(pipesAsString);
});


export { buildHooks, listHooks, executeHook, executePipe, listPipes };
