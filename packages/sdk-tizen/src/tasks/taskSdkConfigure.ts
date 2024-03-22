import { logTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';

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
    options: [],
    platforms: ['tizen', 'tizenwatch', 'tizenmobile'],
};

export default Task;
