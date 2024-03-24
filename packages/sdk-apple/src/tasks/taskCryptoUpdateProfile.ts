import { RnvTaskFn, executeTask, shouldSkipTask, logTask, RnvTask, RnvTaskName } from '@rnv/core';
import { updateProfile } from '../fastlane';
import { SdkPlatforms } from '../common';

const fn: RnvTaskFn = async (_c, _parentTask, originTask) => {
    logTask('taskCryptoUpdateProfile');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.cryptoUpdateProfile, originTask);

    if (shouldSkipTask(RnvTaskName.cryptoUpdateProfile, originTask)) return true;

    await updateProfile();
};

const Task: RnvTask = {
    description: 'Update provisioning profile (mac only)',
    fn,
    task: RnvTaskName.cryptoUpdateProfile,
    platforms: SdkPlatforms,
};

export default Task;
