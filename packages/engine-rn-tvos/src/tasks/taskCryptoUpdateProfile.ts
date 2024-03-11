import { RnvTaskFn, executeTask, shouldSkipTask, logTask, RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

const taskCryptoUpdateProfile: RnvTaskFn = async (_c, _parentTask, originTask) => {
    logTask('taskCryptoUpdateProfile');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.cryptoUpdateProfile, originTask);

    if (shouldSkipTask(RnvTaskName.cryptoUpdateProfile, originTask)) return true;

    await updateProfile();
};

const Task: RnvTask = {
    description: 'Update provisioning profile (mac only)',
    fn: taskCryptoUpdateProfile,
    task: RnvTaskName.cryptoUpdateProfile,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['tvos'],
    // skipPlatforms: true,
};

export default Task;
