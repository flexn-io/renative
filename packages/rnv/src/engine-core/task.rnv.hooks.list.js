import { logToSummary, logTask } from '../core/systemManager/logger';
import { generateOptions } from '../cli/prompt';
import { buildHooks } from '../core/projectManager/buildHooks';


export const taskRnvHooksList = (c, parentTask, originTask) => new Promise((resolve, reject) => {
    logTask('taskRnvHooksList', `parent:${parentTask} origin:${originTask}`);

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

export default {
    description: '',
    fn: taskRnvHooksList,
    task: 'hooks list',
    params: [],
    platforms: [],
};
