import { logErrorPlatform, logTask, PARAMS, RnvTaskFn, executeTask, RnvTask, TaskKey } from '@rnv/core';
import { runAndroidLog, checkAndConfigureAndroidSdks } from '@rnv/sdk-android';
import { runAppleLog } from '@rnv/sdk-apple';

import {} from '@rnv/sdk-android';

const taskLog: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskLog', `parent:${parentTask}`);

    await executeTask(c, TaskKey.workspaceConfigure, TaskKey.projectConfigure, originTask);

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
    fn: taskLog,
    task: TaskKey.log,
    params: PARAMS.withBase(),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
    isGlobalScope: true,
};

export default Task;
