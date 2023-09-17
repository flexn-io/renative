import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    WEB,
    CHROMECAST,
    TASK_BUILD,
    TASK_PACKAGE,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
} from '@rnv/core';
import { buildWebNext } from '../sdks/sdk-next';

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case WEB:
        case CHROMECAST:
            await buildWebNext(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, CHROMECAST],
};
