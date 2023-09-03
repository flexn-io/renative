import { TaskManager, Constants, Logger, PlatformManager, RnvTaskFn } from 'rnv';
import { SDKNext } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { WEB, CHROMECAST, TASK_RUN, TASK_CONFIGURE, PARAMS } = Constants;
const { runWebNext } = SDKNext;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    logTask('taskRnvRun', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    switch (platform) {
        case WEB:
        case CHROMECAST:
            c.runtime.shouldOpenBrowser = true;
            return runWebNext(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app in browser',
    fn: taskRnvRun,
    task: TASK_RUN,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [WEB, CHROMECAST],
};
