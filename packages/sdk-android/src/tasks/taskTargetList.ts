import { RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { listAndroidTargets } from '../deviceManager';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { SdkPlatforms } from '../constants';

const Task: RnvTask = {
    description: 'List all available targets for specific platform',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureAndroidSdks();
        await checkAndroidSdk();
        return listAndroidTargets();
    },
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
};

export default Task;
