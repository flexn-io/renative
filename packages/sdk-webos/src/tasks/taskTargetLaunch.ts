import { RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { getTargetWithOptionalPrompt } from '@rnv/sdk-utils';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '../installer';
import { launchWebOSimulator } from '../deviceManager';
import { SdkPlatforms } from '../constants';

const Task: RnvTask = {
    description: 'Launch specific target',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureWebosSdks();
        const target = await getTargetWithOptionalPrompt();
        await checkWebosSdk();
        return launchWebOSimulator(target);
    },
    task: RnvTaskName.targetLaunch,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
};

export default Task;
