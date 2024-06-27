import { createTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Configures sdks',
    isPrivate: true,
    fn: async () => {
        await checkAndConfigureTizenSdks();
        await checkTizenSdk(true);
    },
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
});
