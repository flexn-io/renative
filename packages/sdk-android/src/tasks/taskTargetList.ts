import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { listAndroidTargets } from '../deviceManager';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { SdkPlatforms } from '../constants';
import { TaskOptions } from '../taskOptions';

export default createTask({
    description: 'List all available targets for specific platform',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureAndroidSdks();
        await checkAndroidSdk();
        return listAndroidTargets();
    },
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target, TaskOptions.resetAdb, TaskOptions.skipTargetCheck],
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
