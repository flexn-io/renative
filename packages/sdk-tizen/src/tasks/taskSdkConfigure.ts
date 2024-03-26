import { RnvTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { SdkPlatforms } from '../constants';

const Task: RnvTask = {
    description: 'Configures sdks',
    isPrivate: true,
    fn: async () => {
        await checkAndConfigureTizenSdks();
        await checkTizenSdk();
    },
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
};

export default Task;
