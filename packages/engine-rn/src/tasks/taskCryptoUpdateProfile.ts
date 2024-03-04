import { logTask, RnvTaskFn, executeTask, shouldSkipTask, RnvTask, TaskKey, RnvTaskOptionPresets } from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

const taskCryptoUpdateProfile: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoUpdateProfile');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.cryptoUpdateProfile, originTask);

    if (shouldSkipTask(c, TaskKey.cryptoUpdateProfile, originTask)) return true;

    await updateProfile(c);
};

const Task: RnvTask = {
    description: 'Update provisioning profile (mac only)',
    fn: taskCryptoUpdateProfile,
    task: TaskKey.cryptoUpdateProfile,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['ios'],
    // skipPlatforms: true,
};

export default Task;
