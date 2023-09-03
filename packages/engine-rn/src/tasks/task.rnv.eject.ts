import { TaskManager, Constants, Logger, PlatformManager, RnvTaskFn } from 'rnv';
import { ejectGradleProject } from '@rnv/sdk-android';
import { ejectXcodeProject } from '@rnv/sdk-apple';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR, TASK_PACKAGE, PARAMS } = Constants;

const TASK_EJECT = 'eject';

const { shouldSkipTask, executeOrSkipTask } = TaskManager;

export const taskRnvEject: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvEject');
    const { platform } = c;

    c.runtime._platformBuildsSuffix = '_eject';

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            c.runtime._platformBuildsSuffix = '_eject/android';
            break;
        default:
        // Do nothing
    }

    c.runtime._skipNativeDepResolutions = true;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_EJECT, originTask);

    if (shouldSkipTask(c, TASK_EJECT, originTask)) return true;

    switch (platform) {
        case IOS:
        case MACOS:
            await ejectXcodeProject(c);
            return true;
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            await ejectGradleProject(c);
            return true;
        default:
            await logErrorPlatform(c);
            return true;
    }
};

export default {
    description: 'Eject current project app to self contained native project',
    fn: taskRnvEject,
    task: 'eject',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};
