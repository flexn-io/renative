import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { WEB,
    CHROMECAST,
    TASK_RUN, TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { runWebNext } from '../../sdk-webpack/webNext';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    logTask('taskRnvRun', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case WEB:
        case CHROMECAST:
            c.runtime.shouldOpenBrowser = true;
            return runWebNext(c, true);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app in browser',
    fn: taskRnvRun,
    task: 'run',
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [
        WEB,
        CHROMECAST,
    ],
};
