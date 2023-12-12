import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    TASK_START,
    TASK_CONFIGURE_SOFT,
    logError,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    MACOS,
    IOS,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

export const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        return logError('This platform does not support hosted mode', true);
    }
    // Disable reset for other commands (ie. cleaning platforms)
    c.runtime.disableReset = true;
    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE_SOFT, TASK_START, originTask);
    }

    if (shouldSkipTask(c, TASK_START, originTask)) return true;

    switch (platform) {
        case IOS:
        case MACOS:
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR: {
            return startReactNative(c, { waitForBundler: !!parentTask });
        }
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TASK_START,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};
