import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import { isPlatformSupportedSync, getConfig, logTask, logComplete, logError, getAppFolder, logWarning, generateOptions } from '../common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { executeAsync, execShellAsync, execCLI } from '../systemTools/exec';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../systemTools/fileutils';
import { PIPES as RUNNER_PIPES } from '../cli/runner';
import { PIPES as PLATFORM_PIPES } from '../cli/platform';
import { PIPES as PLUGIN_PIPES } from '../cli/plugin';
import { PIPES as TARGET_PIPES } from '../cli/target';
import { PIPES as APP_PIPES } from '../cli/app';

const PIPES = { ...RUNNER_PIPES, ...PLATFORM_PIPES, ...PLUGIN_PIPES, ...TARGET_PIPES, ...APP_PIPES };

// ##########################################
// PUBLIC API
// ##########################################

const executeHook = c => new Promise((resolve, reject) => {
    logTask('executeHook');

    buildHooks(c)
        .then(() => {
            if (c.buildHooks[c.program.exeMethod]) {
                c.buildHooks[c.program.exeMethod](c)
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                reject(`Method name ${chalk.white(c.program.exeMethod)} does not exists in your buildHooks!`);
            }
        })
        .catch(e => reject(e));
});

const executePipe = (c, key) => new Promise((resolve, reject) => {
    logTask(`executePipe:${key}`);

    buildHooks(c)
        .then(() => {
            const pipe = c.buildPipes ? c.buildPipes[key] : null;

            if (Array.isArray(pipe)) {
                const chain = pipe
                    .reduce((accumulatorPromise, next) => accumulatorPromise.then(() => next(c)), Promise.resolve())
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            }
            if (pipe) {
                c.buildPipes[key](c)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            }

            resolve();
        })
        .catch(e => reject(e));
});

const buildHooks = c => new Promise((resolve, reject) => {
    logTask('buildHooks');
    if (fs.existsSync(c.paths.buildHooksIndexPath)) {
        if (c.isBuildHooksReady) {
            resolve();
            return;
        }
        // const babel = path.resolve(c.paths.rnvNodeModulesFolder, '.bin/babel');
        const babel = path.resolve(c.paths.rnvNodeModulesFolder, '@babel/cli/bin/babel.js');
        const params = ['--no-babelrc', c.paths.buildHooksFolder, '-d', c.paths.buildHooksDistFolder, '--presets=@babel/env'];
        executeAsync(babel, params)
            .then(() => {
                const h = require(c.paths.buildHooksDistIndexPath);
                c.buildHooks = h.hooks;
                c.buildPipes = h.pipes;
                c.isBuildHooksReady = true;
                resolve();
            })
            .catch((e) => {
                logError(`With Command: ${chalk.white(`${babel} ${params.join(' ')}`)}`);
                console.log(e);
                resolve();
            });
    } else {
        // logWarning(`Your buildHook ${chalk.white(c.paths.buildHooksIndexPath)} is missing!. Skipping operation`);
        resolve();
    }
});

const listHooks = c => new Promise((resolve, reject) => {
    logTask('listHooks');

    buildHooks(c)
        .then(() => {
            if (c.buildHooks) {
                const hookOpts = generateOptions(c.buildHooks);
                let hooksAsString = `\n${chalk.blue('Hooks:')}\n${hookOpts.asString}`;

                if (c.buildPipes) {
                    const pipeOpts = generateOptions(c.buildPipes);
                    hooksAsString += `\n${chalk.blue('Pipes:')}\n${pipeOpts.asString}`;
                }
                console.log(hooksAsString);
                resolve();
            } else {
                reject('Your buildHooks object is empty!');
            }
        })
        .catch(e => reject(e));
});

const listPipes = c => new Promise((resolve, reject) => {
    logTask('listPipes');

    buildHooks(c)
        .then(() => {
            const pipeOpts = generateOptions(c.buildPipes);
            console.log(`Pipes:\n${pipeOpts.asString}`);
        }).catch(e => reject(e));
});

export { buildHooks, listHooks, executeHook, executePipe, listPipes };
