import { runWebpackServer } from '@rnv/sdk-webpack';
import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    logError,
    MACOS,
    WINDOWS,
    LINUX,
    TASK_START,
    TASK_CONFIGURE,
    PARAMS,
    executeTask,
    shouldSkipTask,
} from '@rnv/core';
import { openBrowser, waitForHost } from '@rnv/sdk-utils';

export const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForHost(c, '')
            .then(() => openBrowser(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE, TASK_START, originTask);
    }

    if (shouldSkipTask(c, TASK_START, originTask)) return true;

    switch (platform) {
        case MACOS:
        case WINDOWS:
        case LINUX:
            return runWebpackServer(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TASK_START,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS, WINDOWS, LINUX],
};
