/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE
} from '../core/constants';
import { configureXcodeProject } from '../sdk-xcode';
import { configureGradleProject } from '../sdk-android';
import { executeTask } from '../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure', `parent:${parentTask} origin:${originTask}`);

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    switch (c.platform) {
        case IOS:
        case TVOS:
            return configureXcodeProject(c);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return configureGradleProject(c);
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
