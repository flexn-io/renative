import chalk from 'chalk';
import fs from 'fs';
import {
    getConfig
} from '../common';
import { logToSummary, logTask } from '../systemTools/logger';
import { generateOptions } from '../systemTools/prompt';
import { executeAsync } from '../systemTools/exec';

// ##########################################
// PUBLIC API
// ##########################################

const rnvHooksRun = c => new Promise((resolve, reject) => {
    logTask('rnvHooksRun');

    buildHooks(c)
        .then(() => {
            if (!c.buildHooks) {
                reject('Build hooks have not been compiled properly!');
                return;
            }
            if (c.buildHooks[c.program?.exeMethod]) {
                c.buildHooks[c.program?.exeMethod](c)
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                reject(`Method name ${chalk.white(c.program.exeMethod)} does not exists in your buildHooks!`);
            }
        })
        .catch(e => reject(e));
});

const executePipe = async (c, key) => {
    logTask(`executePipe:${key}`);

    await buildHooks(c);

    const pipe = c.buildPipes ? c.buildPipes[key] : null;

    if (Array.isArray(pipe)) {
        await pipe.reduce((accumulatorPromise, next) => accumulatorPromise.then(() => next(c)), Promise.resolve());
    } else if (pipe) {
        await pipe(c);
    }
};

const buildHooks = c => new Promise((resolve, reject) => {
    logTask('buildHooks');

    if (fs.existsSync(c.paths.buildHooks.index)) {
        if (c.isBuildHooksReady) {
            resolve();
            return;
        }

        executeAsync(c, `babel --no-babelrc --plugins @babel/plugin-proposal-optional-chaining,@babel/plugin-proposal-nullish-coalescing-operator ${c.paths.buildHooks.dir} -d ${c.paths.buildHooks.dist.dir} --presets=@babel/env`, {
            cwd: c.paths.buildHooks.dir
        })
            .then(() => {
                const h = require(c.paths.buildHooks.dist.index);
                c.buildHooks = h.hooks;
                c.buildPipes = h.pipes;
                c.isBuildHooksReady = true;
                resolve();
            })
            .catch((e) => {
                // logWarning(`BUILD_HOOK Failed with error: ${e}`);
                // resolve();
                // Fail Builds instead of warn when hook fails
                reject(`BUILD_HOOK Failed with error: ${e}`);
            });
    } else {
        // logWarning(`Your buildHook ${chalk.white(c.paths.buildHooks.index)} is missing!. Skipping operation`);
        resolve();
    }
});

const rnvHooksList = c => new Promise((resolve, reject) => {
    logTask('rnvHooksList');

    buildHooks(c)
        .then(() => {
            if (c.buildHooks) {
                const hookOpts = generateOptions(c.buildHooks);
                let hooksAsString = `\n${'Hooks:'}\n${hookOpts.asString}`;

                if (c.buildPipes) {
                    const pipeOpts = generateOptions(c.buildPipes);
                    hooksAsString += `\n${'Pipes:'}\n${pipeOpts.asString}`;
                }
                logToSummary(hooksAsString);
                resolve();
            } else {
                reject('Your buildHooks object is empty!');
            }
        })
        .catch(e => reject(e));
});

const rnvHooksPipes = c => new Promise((resolve, reject) => {
    logTask('rnvHooksPipes');

    buildHooks(c)
        .then(() => {
            const pipeOpts = generateOptions(c.buildPipes);
            console.log(`Pipes:\n${pipeOpts.asString}`);
        }).catch(e => reject(e));
});

export { buildHooks, rnvHooksList, rnvHooksRun, executePipe, rnvHooksPipes };
