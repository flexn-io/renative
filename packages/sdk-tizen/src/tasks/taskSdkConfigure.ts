import { logTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { SdkPlatforms } from '../constants';

const fn: RnvTaskFn = async () => {
    logTask('taskSdkConfigure');

    await checkAndConfigureTizenSdks();
    await checkTizenSdk();
};

const Task: RnvTask = {
    description: 'Configures sdks',
    isPrivate: true,
    fn,
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
};

export default Task;
