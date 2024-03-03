import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    logError,
    PARAMS,
    executeTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { runWebNext } from '../sdk';
import { openBrowser, waitForHost } from '@rnv/sdk-utils';

const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForHost(c)
            .then(() => openBrowser(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    if (!parentTask) {
        await executeTask(c, TaskKey.configure, TaskKey.start, originTask);
    }

    if (shouldSkipTask(c, TaskKey.start, originTask)) return true;

    if (hosted) {
        return logError('This platform does not support hosted mode', true);
    }
    switch (platform) {
        case 'web':
        case 'chromecast':
            c.runtime.shouldOpenBrowser = false;
            return runWebNext(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TaskKey.start,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
