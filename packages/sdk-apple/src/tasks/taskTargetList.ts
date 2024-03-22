import {
    isPlatformSupported,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { listAppleDevices } from '../deviceManager';

const taskTargetList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetList');

    await isPlatformSupported(true);
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetList, originTask);
    return listAppleDevices(c);
};

const Task: RnvTask = {
    description: 'List all available targets for specific platform',
    fn: taskTargetList,
    task: RnvTaskName.targetList,
    options: RnvTaskOptionPresets.withBase(),
    platforms: null,
    isGlobalScope: true, //TODO: evaluate this after moving to SDK
};

export default Task;
