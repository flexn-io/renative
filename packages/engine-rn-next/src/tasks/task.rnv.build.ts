import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TASK_BUILD,
    TASK_PACKAGE,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    TASK_EXPORT,
    RnvTask,
} from '@rnv/core';
import { buildWebNext } from '../sdk';

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'chromecast':
            if (parentTask === TASK_EXPORT) {
                // build task is not necessary when exporting. They do the same thing, only difference is a next.config.js config flag
                return true;
            }
            await buildWebNext(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
