import { logDebug, logHook } from '../systemManager/logger';
import { executeAsync } from '../systemManager/exec';
import { fsExistsSync } from '../systemManager/fileutils';

export const executePipe = async (c, key) => {
    logHook('executePipe', `('${key}')`);

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
    logDebug('buildHooks');

    if (fsExistsSync(c.paths.buildHooks.index)) {
        if (c.isBuildHooksReady) {
            return true;
        }

        const cmd = 'babel';

        try {
            logHook('buildHooks', 'Build hooks not complied. BUILDING...');
            await executeAsync(
                c,
                `${cmd} ${c.paths.buildHooks.dir} -d ${c.paths.buildHooks.dist.dir}`,
                { cwd: c.paths.project.dir, silent: true }
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
