import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { launchTizenEmulator } from '../deviceManager';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Launch specific target',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureTizenSdks();
        const target = await getTargetWithOptionalPrompt();
        await checkTizenSdk();
        return launchTizenEmulator(target);
    },
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
