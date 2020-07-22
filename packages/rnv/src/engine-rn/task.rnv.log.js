import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR
} from '../core/constants';
import { runAppleLog } from '../sdk-xcode';
import { runAndroidLog } from '../sdk-android';

export const taskRnvLog = async (c, parentTask) => {
    logTask('taskRnvLog', `parent:${parentTask}`);
    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return runAndroidLog(c);
        case IOS:
        case TVOS:
            return runAppleLog(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Attach logger to device or emulator and print out logs',
    fn: taskRnvLog,
    task: 'log',
    params: [],
    platforms: [],
    skipProjectSetup: true,
};
