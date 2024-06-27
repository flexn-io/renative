import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { listKaiosTargets } from '../deviceManager';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'List all available targets for specific platform',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        return listKaiosTargets();
    },
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
