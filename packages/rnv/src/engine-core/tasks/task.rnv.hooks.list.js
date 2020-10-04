import { logToSummary, logTask } from '../../core/systemManager/logger';
import { generateOptions } from '../../cli/prompt';
import { buildHooks } from '../../core/projectManager/buildHooks';
import { executeTask } from '../../core/engineManager';
import { TASK_HOOKS_LIST, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


export const taskRnvHooksList = async (c, parentTask, originTask) => {
    logTask('taskRnvHooksList');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_HOOKS_LIST, originTask);

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
    description: 'Get list of all available hooks',
    fn: taskRnvHooksList,
    task: TASK_HOOKS_LIST,
    params: PARAMS.withBase(),
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true
};
