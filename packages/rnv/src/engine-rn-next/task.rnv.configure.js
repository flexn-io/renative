/* eslint-disable import/no-cycle */
import { configureGenericPlatform, logErrorPlatform } from '../core/platformManager';
import { configureGenericProject } from '../core/projectManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST
} from '../core/constants';
import { configureNextIfRequired } from '../sdk-webpack/webNext';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure', `parent:${parentTask} origin:${originTask}`);

    await configureGenericPlatform(c);
    await configureGenericProject(c);

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
    subTask: null,
    params: [],
    platforms: [],
};
