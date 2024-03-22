import { isPlatformSupported, logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { listAppleDevices } from '../deviceManager';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetList');

    await isPlatformSupported(true);
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetList, originTask);
    return listAppleDevices(c);
};

const Task: RnvTask = {
    description: 'List all available targets for specific platform',
    fn,
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target],
    platforms: ['ios', 'macos', 'tvos'],
    isGlobalScope: true, //TODO: evaluate this after moving to SDK
};

export default Task;
