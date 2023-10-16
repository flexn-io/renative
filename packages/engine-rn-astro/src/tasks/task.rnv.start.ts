import { runAstroServer } from '@rnv/sdk-astro';
import open from 'better-opn';
import {
    RnvTaskFn,
    waitForHost,
    logErrorPlatform,
    logTask,
    logError,
    WEB,
    WEBTV,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    CHROMECAST,
    TASK_START,
    TASK_CONFIGURE,
    PARAMS,
    executeTask,
    shouldSkipTask,
} from '@rnv/core';

export const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    if (!platform) return;

    logTask('taskRnvStart', `parent:${parentTask} port:${port} hosted:${!!hosted}`);

    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE, TASK_START, originTask);
    }

    if (shouldSkipTask(c, TASK_START, originTask)) return true;

    if (hosted) {
        waitForHost(c, '')
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    switch (platform) {
        case WEB:
        case WEBTV:
        case TIZEN:
        case WEBOS:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            // c.runtime.keepSessionActive = true;
            return runAstroServer(c);
        default:
            if (hosted) {
                return logError('This platform does not support hosted mode', true);
            }
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TASK_START,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, WEBTV, TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH, KAIOS, CHROMECAST],
};
