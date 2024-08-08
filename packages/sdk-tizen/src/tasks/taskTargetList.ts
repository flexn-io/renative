import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { listTizenTargets } from '../deviceManager';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'List all available targets for specific platform',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async ({ ctx }) => {
        await checkAndConfigureTizenSdks();
        await checkTizenSdk();
        return listTizenTargets(ctx.platform || '');
    },
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
