import { updateProfile } from '../../sdk-xcode/fastlane';
import { logTask } from '../../core/systemManager/logger';
import { executeTask } from '../../core/engineManager';
import { TASK_CRYPTO_UPDATE_PROFILE, TASK_PROJECT_CONFIGURE, IOS, TVOS, PARAMS } from '../../core/constants';


export const taskRnvCryptoUpdateProfile = async (c, parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfile');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_UPDATE_PROFILE, originTask);

    await updateProfile(c);
};

export default {
    description: 'Update provisioning profile',
    fn: taskRnvCryptoUpdateProfile,
    task: TASK_CRYPTO_UPDATE_PROFILE,
    params: PARAMS.withBase(),
    platforms: [IOS, TVOS],
    skipPlatforms: true,
};
