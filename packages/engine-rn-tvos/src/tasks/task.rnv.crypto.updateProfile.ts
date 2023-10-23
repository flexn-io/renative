import {
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    logTask,
    TASK_CRYPTO_UPDATE_PROFILE,
    TASK_PROJECT_CONFIGURE,
    TVOS,
    PARAMS,
} from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

export const taskRnvCryptoUpdateProfile: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfile');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_UPDATE_PROFILE, originTask);

    if (shouldSkipTask(c, TASK_CRYPTO_UPDATE_PROFILE, originTask)) return true;

    await updateProfile(c);
};

export default {
    description: 'Update provisioning profile',
    fn: taskRnvCryptoUpdateProfile,
    task: TASK_CRYPTO_UPDATE_PROFILE,
    params: PARAMS.withBase(),
    platforms: [TVOS],
    skipPlatforms: true,
};
