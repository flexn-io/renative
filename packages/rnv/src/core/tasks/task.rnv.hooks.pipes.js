import { logTask, logRaw } from '../systemManager/logger';
import { generateOptions } from '../../cli/prompt';
import { buildHooks } from '../projectManager/buildHooks';

export const taskRnvHooksPipes = c => new Promise((resolve, reject) => {
    logTask('taskRnvHooksPipes');

    buildHooks(c)
        .then(() => {
            const pipeOpts = generateOptions(c.buildPipes);
            logRaw(`Pipes:\n${pipeOpts.asString}`);
        })
        .catch(e => reject(e));
});
