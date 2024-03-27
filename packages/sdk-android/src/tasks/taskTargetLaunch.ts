import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '../installer';
import { launchAndroidSimulator } from '../deviceManager';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Launch specific target',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureAndroidSdks();
        const target = await getTargetWithOptionalPrompt();
        await checkAndroidSdk();
        return launchAndroidSimulator(target);
    },
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
