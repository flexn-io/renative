import {
    isPlatformSupported,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { launchAndroidSimulator } from '../deviceManager';

const taskTargetLaunch: RnvTaskFn = async (c, _parentTask, originTask) => {
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
    fn: taskTargetLaunch,
    task: RnvTaskName.targetLaunch,
    options: RnvTaskOptionPresets.withBase(),
    platforms: null,
    isGlobalScope: true,
};

export default Task;
