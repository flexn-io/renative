/* eslint-disable import/no-cycle */
import { updateProfile } from '../sdk-xcode/fastlane';
import { logTask } from '../core/systemManager/logger';

export const taskRnvCryptoUpdateProfile = async (c, parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfile', `parent:${parentTask} origin:${originTask}`);

    await updateProfile(c);
};

export default {
    description: '',
    fn: taskRnvCryptoUpdateProfile,
    task: 'crypto updateProfile',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
