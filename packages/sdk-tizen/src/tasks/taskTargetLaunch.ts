import { isPlatformSupported, logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { launchTizenSimulator } from '../deviceManager';

const taskTargetLaunch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetLaunch');

    await isPlatformSupported(true);
    await checkAndConfigureTizenSdks();
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetLaunch, originTask);

    const target = await getTargetWithOptionalPrompt();

    await checkTizenSdk();
    return launchTizenSimulator(target);
};

const Task: RnvTask = {
    description: 'Launch specific target',
    fn: taskTargetLaunch,
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: ['tizen', 'tizenwatch', 'tizenmobile'],
    isGlobalScope: true,
};

export default Task;
