import { RnvTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { SdkPlatforms } from '../constants';

const Task: RnvTask = {
    description: 'Configures sdks',
    isPrivate: true,
    fn: async () => {
        await checkAndConfigureAndroidSdks();
        return checkAndroidSdk();
    },
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
};

export default Task;
