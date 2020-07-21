/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST,
    TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE
} from '../core/constants';
import { configureNextIfRequired } from '../sdk-webpack/webNext';
import { executeTask } from '../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure', `parent:${parentTask} origin:${originTask}`);

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    switch (c.platform) {
        case WEB:
        case CHROMECAST:
            return configureNextIfRequired(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvConfigure,
    task: 'configure',
    params: [],
    platforms: [],
};
