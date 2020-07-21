/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST,
    TASK_EXPORT,
    TASK_DEPLOY,
} from '../core/constants';
import { deployWeb } from '../sdk-webpack';
import { executeTask as _executeTask } from '../core/engineManager';

export const taskRnvDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await _executeTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    switch (platform) {
        case WEB:
            return deployWeb(c, platform);
        case CHROMECAST:
            return deployWeb(c, platform);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvDeploy,
    task: 'deploy',
    params: [],
    platforms: [],
};
