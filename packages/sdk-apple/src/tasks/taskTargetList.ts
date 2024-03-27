import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { listAppleDevices } from '../deviceManager';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'List all available targets for specific platform',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        return listAppleDevices();
    },
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true, //TODO: evaluate this after moving to SDK
});
