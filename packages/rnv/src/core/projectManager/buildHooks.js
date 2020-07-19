/* eslint-disable import/no-cycle */
import fs from 'fs';
import { chalk, logToSummary, logTask, logRaw, logHook } from '../systemManager/logger';
import { generateOptions } from '../../cli/prompt';
import { executeAsync } from '../systemManager/exec';

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
                reject(
                    `Method name ${chalk().white(
                        c.program.exeMethod
                    )} does not exists in your buildHooks!`
                );
            }
        })
        .catch(e => reject(e));
});

const executePipe = async (c, key) => {
    logHook('executePipe', `${key}`);

    const pipesConfig = c.buildConfig?.pipes;
    if (!pipesConfig || (pipesConfig && pipesConfig.includes(key))) {
        await buildHooks(c);
    }

    const pipe = c.buildPipes ? c.buildPipes[key] : null;

    if (Array.isArray(pipe)) {
        await pipe.reduce(
            (accumulatorPromise, next) => {
                // console.log('DDJHDGD', next?.name);
                logHook(`buildHook.${next?.name}`, '(EXECUTING)');
                return accumulatorPromise.then(() => next(c));
            },
            Promise.resolve()
        );
    } else if (pipe) {
        logHook(`buildHook.${pipe?.name}`, '(EXECUTING)');
        await pipe(c);
    }
};

/* eslint-disable import/no-dynamic-require, global-require */
const buildHooks = async (c) => {
    logTask('buildHooks');

    if (fs.existsSync(c.paths.buildHooks.index)) {
        if (c.isBuildHooksReady) {
            return true;
        }

        const cmd = 'babel --no-babelrc --plugins @babel/plugin-proposal-optional-chaining,@babel/plugin-proposal-nullish-coalescing-operator';

        try {
            await executeAsync(
                c,
                `${cmd} ${c.paths.buildHooks.dir} -d ${c.paths.buildHooks.dist.dir} --presets=@babel/env`,
                {
                    cwd: c.paths.buildHooks.dir
                }
            );

            const h = require(c.paths.buildHooks.dist.index);
            c.buildHooks = h.hooks;
            c.buildPipes = h.pipes;
            c.isBuildHooksReady = true;
            return true;
        } catch (e) {
            // logWarning(`BUILD_HOOK Failed with error: ${e}`);
            // resolve();
            // Fail Builds instead of warn when hook fails
            return Promise.reject(`BUILD_HOOK Failed with error: ${e}`);
        }
    }
    return true;
};

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
            logRaw(`Pipes:\n${pipeOpts.asString}`);
        })
        .catch(e => reject(e));
});

export { buildHooks, rnvHooksList, rnvHooksRun, executePipe, rnvHooksPipes };
