import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    TASK_BUILD,
    TASK_EXPORT,
    executeOrSkipTask,
    shouldSkipTask,
    TASK_PACKAGE,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    MACOS,
    IOS,
    RnvTask,
} from '@rnv/core';
import { buildReactNativeAndroid } from '@rnv/sdk-react-native';
import { buildXcodeProject } from '@rnv/sdk-apple';

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild');
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            return buildReactNativeAndroid(c);
        case IOS:
        case MACOS:
            if (parentTask === TASK_EXPORT) {
                // build task is not necessary when exporting ios
                return true;
            }
            return buildXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, MACOS],
};

export default Task;
