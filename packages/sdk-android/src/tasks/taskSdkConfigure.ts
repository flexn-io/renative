import { logTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { SdkPlatforms } from '../constants';

const fn: RnvTaskFn = async () => {
    logTask('taskSdkConfigure');

    await checkAndConfigureAndroidSdks();
    await checkAndroidSdk();
};

const Task: RnvTask = {
    description: 'Configures sdks',
    isPrivate: true,
    fn,
    task: RnvTaskName.sdkConfigure,
    platforms: SdkPlatforms,
};

export default Task;
