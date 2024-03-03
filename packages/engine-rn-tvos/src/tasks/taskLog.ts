import { logTask, PARAMS, executeTask, logErrorPlatform, RnvTaskFn, RnvTask, TaskKey } from '@rnv/core';

import { runAppleLog } from '@rnv/sdk-apple';
import { runAndroidLog, checkAndConfigureAndroidSdks } from '@rnv/sdk-android';

const taskRnvLog: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvLog', `parent:${parentTask}`);

    await executeTask(c, TaskKey.workspaceConfigure, TaskKey.projectConfigure, originTask);

    switch (c.platform) {
        case 'androidtv':
        case 'firetv':
            await checkAndConfigureAndroidSdks(c);
            return runAndroidLog(c);
        case 'tvos':
            return runAppleLog(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Attach logger to device or emulator and print out logs',
    fn: taskRnvLog,
    task: TaskKey.log,
    params: PARAMS.withBase(),
    platforms: ['tvos', 'androidtv', 'firetv'],
    isGlobalScope: true,
};

export default Task;
