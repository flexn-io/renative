/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST,
    TASK_BUILD, TASK_EXPORT
} from '../core/constants';
import { exportWebNext } from '../sdk-webpack/webNext';
import { executeTask } from '../core/engineManager';

export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case WEB:
        case CHROMECAST:
            return exportWebNext(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvExport,
    task: 'export',
    subTask: null,
    params: [],
    platforms: [],
};
