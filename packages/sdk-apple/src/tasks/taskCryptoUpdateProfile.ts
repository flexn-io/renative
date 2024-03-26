import { RnvTask, RnvTaskName } from '@rnv/core';
import { updateProfile } from '../fastlane';
import { SdkPlatforms } from '../common';

const Task: RnvTask = {
    description: 'Update provisioning profile (mac only)',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        return updateProfile();
    },
    task: RnvTaskName.cryptoUpdateProfile,
    platforms: SdkPlatforms,
};

export default Task;
