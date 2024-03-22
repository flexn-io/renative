import {
    isPlatformSupported,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { listAndroidTargets } from '../deviceManager';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';

const taskTargetList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetList');

    await isPlatformSupported(true);
    await checkAndConfigureAndroidSdks();
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetList, originTask);
    await checkAndroidSdk();

    return listAndroidTargets();
};

const Task: RnvTask = {
    description: 'List all available targets for specific platform',
    fn: taskTargetList,
    task: RnvTaskName.targetList,
    options: RnvTaskOptionPresets.withBase(),
    platforms: null,
    isGlobalScope: true,
};

export default Task;
