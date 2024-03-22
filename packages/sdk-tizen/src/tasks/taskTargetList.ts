import {
    isPlatformSupported,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { listTizenTargets } from '../deviceManager';

const taskTargetList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetList');

    await isPlatformSupported(true);
    await checkAndConfigureTizenSdks();
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetList, originTask);
    await checkTizenSdk();

    return listTizenTargets();
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
