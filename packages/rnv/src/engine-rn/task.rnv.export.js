/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_BUILD, TASK_EXPORT
} from '../core/constants';
import { exportXcodeProject } from '../sdk-xcode';
import { executeTask } from '../core/engineManager';


export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case IOS:
        case TVOS:
            return exportXcodeProject(c, platform);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            // Android Platforms don't need extra export step
            return true;
        default:
            return logErrorPlatform(c);
    }
};
