import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeTask,
    TASK_WORKSPACE_CONFIGURE,
    TASK_PROJECT_CONFIGURE,
    RnvTask,
    TASK_LOG,
} from '@rnv/core';
import { runAndroidLog, checkAndConfigureAndroidSdks } from '@rnv/sdk-android';
import { runAppleLog } from '@rnv/sdk-apple';

import {} from '@rnv/sdk-android';

export const taskRnvLog: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvLog', `parent:${parentTask}`);

    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_PROJECT_CONFIGURE, originTask);

    switch (c.platform) {
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            await checkAndConfigureAndroidSdks(c);
            return runAndroidLog(c);
        case 'ios':
            return runAppleLog(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Attach logger to device or emulator and print out logs',
    fn: taskRnvLog,
    task: TASK_LOG,
    params: PARAMS.withBase(),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
    isGlobalScope: true,
};

export default Task;
