/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    TASK_BUILD, TASK_EXPORT,
} from '../core/constants';
import { exportWeb } from '../sdk-webpack';
import { executeTask as _executeTask } from '../core/engineManager';

export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('_taskExport', `parent:${parentTask}`);

    const { platform } = c;

    await _executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case WEB:
            return exportWeb(c, platform);
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
