import { isPlatformSupported, logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { launchAppleSimulator } from '../deviceManager';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetLaunch');

    await isPlatformSupported(true);
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetLaunch, originTask);

    const target = await getTargetWithOptionalPrompt();

    return launchAppleSimulator(target);
};

const Task: RnvTask = {
    description: 'Launch specific ios target',
    fn,
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: ['ios', 'macos', 'tvos'],
    isGlobalScope: true,
};

export default Task;
