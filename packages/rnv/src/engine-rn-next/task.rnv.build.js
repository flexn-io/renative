import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST,
    TASK_BUILD, TASK_PACKAGE,
} from '../core/constants';
import { buildWebNext } from '../sdk-webpack/webNext';
import { executeTask } from '../core/engineManager';

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

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
    params: [],
    platforms: [
        WEB,
        CHROMECAST,
    ],
};
