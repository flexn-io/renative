import {
    logTask,
    PARAMS,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    IOS,
    TASK_PROJECT_CONFIGURE,
    TASK_CRYPTO_UPDATE_PROFILE,
    RnvTask,
} from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

export const taskRnvCryptoUpdateProfile: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfile');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_UPDATE_PROFILE, originTask);

    if (shouldSkipTask(c, TASK_CRYPTO_UPDATE_PROFILE, originTask)) return true;

    await updateProfile(c);
};

const Task: RnvTask = {
    description: 'Update provisioning profile',
    fn: taskRnvCryptoUpdateProfile,
    task: TASK_CRYPTO_UPDATE_PROFILE,
    params: PARAMS.withBase(),
    platforms: [IOS],
    // skipPlatforms: true,
};

export default Task;
