/* eslint-disable import/no-cycle */
import { configureGenericPlatform, logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR
} from '../core/constants';
import { configureGenericProject } from '../core/projectManager';
import { configureXcodeProject } from '../sdk-xcode';
import { configureGradleProject } from '../sdk-android';


export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure', `parent:${parentTask} origin:${originTask}`);

    await configureGenericPlatform(c);
    await configureGenericProject(c);

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
