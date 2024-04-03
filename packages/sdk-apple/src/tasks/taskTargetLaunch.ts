import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { launchAppleSimulator } from '../deviceManager';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Launch specific ios target',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        const target = await getTargetWithOptionalPrompt();
        return launchAppleSimulator(target);
    },
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
