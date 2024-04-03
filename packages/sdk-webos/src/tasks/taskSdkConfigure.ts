import { createTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '../installer';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Configures sdks',
    isPrivate: true,
    fn: async () => {
        await checkAndConfigureWebosSdks();
        await checkWebosSdk();
    },
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
});
