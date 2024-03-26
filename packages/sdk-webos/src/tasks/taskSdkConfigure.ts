import { RnvTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '../installer';
import { SdkPlatforms } from '../constants';

const Task: RnvTask = {
    description: 'Configures sdks',
    isPrivate: true,
    fn: async () => {
        await checkAndConfigureWebosSdks();
        await checkWebosSdk();
    },
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
};

export default Task;
