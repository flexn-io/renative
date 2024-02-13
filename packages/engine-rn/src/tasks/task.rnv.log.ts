import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeTask,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    IOS,
    TASK_WORKSPACE_CONFIGURE,
    TASK_PROJECT_CONFIGURE,
    RnvTask,
} from '@rnv/core';
import { runAndroidLog, checkAndConfigureAndroidSdks } from '@rnv/sdk-android';
import { runAppleLog } from '@rnv/sdk-apple';

import {} from '@rnv/sdk-android';

export const taskRnvLog: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvLog', `parent:${parentTask}`);

    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_PROJECT_CONFIGURE, originTask);

    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            await checkAndConfigureAndroidSdks(c);
            return runAndroidLog(c);
        case IOS:
            return runAppleLog(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Attach logger to device or emulator and print out logs',
    fn: taskRnvLog,
    task: 'log',
    params: PARAMS.withBase(),
    platforms: [IOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
    isGlobalScope: true,
};

export default Task;
