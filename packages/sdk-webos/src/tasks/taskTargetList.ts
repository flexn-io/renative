import {
    isPlatformSupported,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '../installer';
import { listWebOSTargets } from '../deviceManager';

const taskTargetList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetList');

    await isPlatformSupported(true);
    await checkAndConfigureWebosSdks();
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetList, originTask);
    await checkWebosSdk();

    return listWebOSTargets();
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
