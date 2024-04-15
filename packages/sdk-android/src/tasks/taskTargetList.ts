import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { listAndroidTargets } from '../deviceManager';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { SdkPlatforms } from '../constants';

export default createTask({
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
});
