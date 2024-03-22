import { isPlatformSupported, logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { launchKaiOSSimulator } from '../deviceManager';

const taskTargetLaunch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetLaunch');

    await isPlatformSupported(true);
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetLaunch, originTask);

    const target = await getTargetWithOptionalPrompt();

    return launchKaiOSSimulator(target);
};

const Task: RnvTask = {
    description: 'Launch specific target',
    fn: taskTargetLaunch,
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: ['kaios'],
    isGlobalScope: true,
};

export default Task;
