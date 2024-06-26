import { createTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Configures sdks',
    isPrivate: true,
    fn: async () => {
        await checkAndConfigureAndroidSdks();
        return checkAndroidSdk();
    },
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
});
