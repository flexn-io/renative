import { logTask, RnvTaskFn, executeTask, RnvTask, RnvTaskName } from '@rnv/core';

import {} from '@rnv/sdk-android';
import { runAndroidLog } from '../runner';
import { checkAndConfigureAndroidSdks } from '../installer';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskLog', `parent:${parentTask}`);

    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.projectConfigure, originTask);

    await checkAndConfigureAndroidSdks();
    return runAndroidLog();
};

const Task: RnvTask = {
    description: 'Attach logger to device or emulator and print out logs',
    fn,
    task: RnvTaskName.log,
    platforms: ['android', 'androidtv', 'androidwear', 'firetv'],
    isGlobalScope: true,
};

export default Task;
