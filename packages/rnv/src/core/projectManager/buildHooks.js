/* eslint-disable import/no-cycle */
import fs from 'fs';
import { logTask, logHook } from '../systemManager/logger';
import { executeAsync } from '../systemManager/exec';

export const executePipe = async (c, key) => {
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
export const buildHooks = async (c) => {
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
