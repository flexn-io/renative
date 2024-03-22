import { isPlatformSupported, logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '../installer';
import { launchWebOSimulator } from '../deviceManager';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetLaunch');

    await isPlatformSupported(true);
    await checkAndConfigureWebosSdks();
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetLaunch, originTask);

    const target = await getTargetWithOptionalPrompt();

    await checkWebosSdk();
    return launchWebOSimulator(target);
};

const Task: RnvTask = {
    description: 'Launch specific target',
    fn,
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: ['webos'],
    isGlobalScope: true,
};

export default Task;
