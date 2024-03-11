import { logTask, RnvTaskFn, executeTask, shouldSkipTask, RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

const taskCryptoUpdateProfile: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoUpdateProfile');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.cryptoUpdateProfile, originTask);

    if (shouldSkipTask(RnvTaskName.cryptoUpdateProfile, originTask)) return true;

    await updateProfile(c);
};

const Task: RnvTask = {
    description: 'Update provisioning profile (mac only)',
    fn: taskCryptoUpdateProfile,
    task: RnvTaskName.cryptoUpdateProfile,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['ios'],
    // skipPlatforms: true,
};

export default Task;
