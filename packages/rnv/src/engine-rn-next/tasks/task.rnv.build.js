import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { WEB,
    CHROMECAST,
    TASK_BUILD, TASK_PACKAGE,
    PARAMS } from '../../core/constants';
import { buildWebNext } from '../../sdk-webpack/webNext';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

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
    task: 'build',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        WEB,
        CHROMECAST,
    ],
};
