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
import { configureMetroConfigs } from './commonEngine';
import { executeTask } from '../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await configureMetroConfigs(c, c.platform);
    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    if (c.program.only && !!parentTask) {
        return true;
    }

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
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: 'configure',
    params: [],
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};
