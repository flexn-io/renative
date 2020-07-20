import { logTask, logRaw } from '../core/systemManager/logger';
import { generateOptions } from '../cli/prompt';
import { buildHooks } from '../core/projectManager/buildHooks';

export const taskRnvHooksPipes = (c, parentTask, originTask) => new Promise((resolve, reject) => {
    logTask('taskRnvHooksPipes', `parent:${parentTask} origin:${originTask}`);

    buildHooks(c)
        .then(() => {
            const pipeOpts = generateOptions(c.buildPipes);
            logRaw(`Pipes:\n${pipeOpts.asString}`);
        })
        .catch(e => reject(e));
});

export default {
    description: '',
    fn: taskRnvHooksPipes,
    task: 'hooks',
    subTask: 'pipes',
    params: [],
    platforms: [],
};
