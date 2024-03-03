import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { runWebNext } from '../sdk';

const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    logTask('taskRnvRun', `parent:${parentTask}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.run, originTask);

    if (shouldSkipTask(c, TaskKey.run, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'chromecast':
            c.runtime.shouldOpenBrowser = true;
            return runWebNext(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Run your app in browser',
    fn: taskRnvRun,
    task: TaskKey.run,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: ['web', 'chromecast'],
};

export default Task;
