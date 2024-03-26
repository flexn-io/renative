import { RnvTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '../installer';
import { listTizenTargets } from '../deviceManager';
import { SdkPlatforms } from '../constants';

const Task: RnvTask = {
    description: 'List all available targets for specific platform',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureTizenSdks();
        await checkTizenSdk();
        return listTizenTargets();
    },
    task: RnvTaskName.targetList,
    options: [RnvTaskOptions.target],
    platforms: SdkPlatforms,
    isGlobalScope: true,
};

export default Task;
