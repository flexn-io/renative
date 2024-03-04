import {
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    logErrorPlatform,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

import { runAppleLog } from '@rnv/sdk-apple';
import { runAndroidLog, checkAndConfigureAndroidSdks } from '@rnv/sdk-android';

const taskLog: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskLog', `parent:${parentTask}`);

    await executeTask(c, RnvTaskName.workspaceConfigure, RnvTaskName.projectConfigure, originTask);

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
    fn: taskLog,
    task: RnvTaskName.log,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['tvos', 'androidtv', 'firetv'],
    isGlobalScope: true,
};

export default Task;
