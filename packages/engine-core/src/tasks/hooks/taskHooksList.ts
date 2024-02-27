import { logToSummary, logTask, generateOptions, buildHooks, executeTask, PARAMS, RnvTaskFn, RnvTask } from '@rnv/core';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';
import { TASK_HOOKS_LIST } from './constants';

export const taskRnvHooksList: RnvTaskFn = async (c, _parentTask, originTask) => {
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
        return;
    }
    return Promise.reject('Your buildHooks object is empty!');
};

const Task: RnvTask = {
    description: 'Get list of all available hooks',
    fn: taskRnvHooksList,
    task: TASK_HOOKS_LIST,
    params: PARAMS.withBase(),
    platforms: [],
    forceBuildHookRebuild: true,
};

export default Task;
