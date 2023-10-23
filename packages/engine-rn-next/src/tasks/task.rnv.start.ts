import open from 'better-opn';
import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    logError,
    WEB,
    CHROMECAST,
    TASK_START,
    TASK_CONFIGURE,
    PARAMS,
    executeTask,
    shouldSkipTask,
    waitForHost,
} from '@rnv/core';
import { runWebNext } from '../sdk';

export const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForHost(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE, TASK_START, originTask);
    }

    if (shouldSkipTask(c, TASK_START, originTask)) return true;

    if (hosted) {
        return logError('This platform does not support hosted mode', true);
    }
    switch (platform) {
        case WEB:
        case CHROMECAST:
            c.runtime.shouldOpenBrowser = false;
            return runWebNext(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TASK_START,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, CHROMECAST],
};
