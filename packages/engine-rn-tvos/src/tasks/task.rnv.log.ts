import {
    logTask,
    PARAMS,
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_WORKSPACE_CONFIGURE,
    TASK_PROJECT_CONFIGURE,
    executeTask,
    logErrorPlatform,
    RnvTaskFn,
} from '@rnv/core';

import { runAppleLog } from '@rnv/sdk-apple';
import { runAndroidLog, checkAndConfigureAndroidSdks } from '@rnv/sdk-android';

export const taskRnvLog: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvLog', `parent:${parentTask}`);

    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_PROJECT_CONFIGURE, originTask);

    switch (c.platform) {
        case ANDROID_TV:
        case FIRE_TV:
            await checkAndConfigureAndroidSdks(c);
            return runAndroidLog(c);
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
    params: PARAMS.withBase(),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
    isGlobalScope: true,
};
