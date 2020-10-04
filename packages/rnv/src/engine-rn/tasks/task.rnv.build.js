import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_BUILD, TASK_PACKAGE, TASK_EXPORT,
    PARAMS } from '../../core/constants';
import { buildXcodeProject } from '../../sdk-xcode';
import {
    buildAndroid,
} from '../../sdk-android';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild');
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return buildAndroid(c);
        case IOS:
        case TVOS:
            if (parentTask === TASK_EXPORT) {
                // build task is not necessary when exporting ios
                return true;
            }
            return buildXcodeProject(c, platform);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: 'build',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};
