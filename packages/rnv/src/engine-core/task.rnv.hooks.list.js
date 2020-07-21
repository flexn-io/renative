import { logToSummary, logTask } from '../core/systemManager/logger';
import { generateOptions } from '../cli/prompt';
import { buildHooks } from '../core/projectManager/buildHooks';

export const taskRnvHooksList = async (c, parentTask, originTask) => {
    logTask('taskRnvHooksList', `parent:${parentTask} origin:${originTask}`);

    await buildHooks(c);

    if (c.buildHooks) {
        const hookOpts = generateOptions(c.buildHooks);
        let hooksAsString = `\n${'Hooks:'}\n${hookOpts.asString}`;

        if (c.buildPipes) {
            const pipeOpts = generateOptions(c.buildPipes);
            hooksAsString += `\n${'Pipes:'}\n${pipeOpts.asString}`;
        }
        logToSummary(hooksAsString);
        return true;
    }
    return Promise.reject('Your buildHooks object is empty!');
};

export default {
    description: '',
    fn: taskRnvHooksList,
    task: 'hooks list',
    params: [],
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true
};
