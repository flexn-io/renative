import { isPlatformSupported, logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { launchAndroidSimulator } from '../deviceManager';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetLaunch');

    await isPlatformSupported(true);
    await checkAndConfigureAndroidSdks();
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetLaunch, originTask);

    const target = await getTargetWithOptionalPrompt();

    await checkAndroidSdk();
    return launchAndroidSimulator(target);
};

const Task: RnvTask = {
    description: 'Launch specific target',
    fn,
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: ['android', 'androidtv', 'androidwear', 'firetv'],
    isGlobalScope: true,
};

export default Task;
