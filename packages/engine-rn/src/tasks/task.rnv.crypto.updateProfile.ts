import { logTask, PARAMS, RnvTaskFn, executeTask, shouldSkipTask, RnvTask } from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';
import { TASK_CRYPTO_UPDATE_PROFILE, TASK_PROJECT_CONFIGURE } from './constants';

export const taskRnvCryptoUpdateProfile: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfile');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_UPDATE_PROFILE, originTask);

    if (shouldSkipTask(c, TASK_CRYPTO_UPDATE_PROFILE, originTask)) return true;

    await updateProfile(c);
};

const Task: RnvTask = {
    description: 'Update provisioning profile (mac only)',
    fn: taskRnvCryptoUpdateProfile,
    task: TASK_CRYPTO_UPDATE_PROFILE,
    params: PARAMS.withBase(),
    platforms: ['ios'],
    // skipPlatforms: true,
};

export default Task;
