/* eslint-disable import/no-cycle */
import { logTask, logRaw } from '../systemManager/logger';
import { generateOptions } from '../../cli/prompt';
import { buildHooks } from '../projectManager/buildHooks';

export const rnvHooksPipes = c => new Promise((resolve, reject) => {
    logTask('rnvHooksPipes');

    buildHooks(c)
        .then(() => {
            const pipeOpts = generateOptions(c.buildPipes);
            logRaw(`Pipes:\n${pipeOpts.asString}`);
        })
        .catch(e => reject(e));
});
