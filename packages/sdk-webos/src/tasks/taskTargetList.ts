import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '../installer';
import { listWebOSTargets } from '../deviceManager';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'List all available targets for specific platform',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureWebosSdks();
        await checkWebosSdk();
        return listWebOSTargets();
    },
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
