import { createTask, RnvTaskName } from '@rnv/core';
import { updateProfile } from '../fastlane';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Update provisioning profile (mac only)',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        return updateProfile();
    },
    task: RnvTaskName.cryptoUpdateProfile,
    platforms: SdkPlatforms,
});
