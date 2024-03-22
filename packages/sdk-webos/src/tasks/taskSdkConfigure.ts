import { logTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '../installer';

const fn: RnvTaskFn = async () => {
    logTask('taskSdkConfigure');

    await checkAndConfigureWebosSdks();
    await checkWebosSdk();
};

const Task: RnvTask = {
    description: 'Configures sdks',
    isPrivate: true,
    fn,
    task: RnvTaskName.sdkConfigure,
    options: [],
    platforms: null,
};

export default Task;
