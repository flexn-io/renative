import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    TASK_BUILD,
    TASK_EXPORT,
    executeOrSkipTask,
    shouldSkipTask,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    MACOS,
    IOS,
    RnvTask,
} from '@rnv/core';
import { exportXcodeProject } from '@rnv/sdk-apple';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case IOS:
        case MACOS:
            return exportXcodeProject(c);
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            // Android Platforms don't need extra export step
            return true;
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};

export default Task;
