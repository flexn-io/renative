import { createTask, RnvTaskName } from '@rnv/core';
import { runAndroidLog } from '../runner';
import { checkAndConfigureAndroidSdks } from '../installer';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Attach logger to device or emulator and print out logs',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        await checkAndConfigureAndroidSdks();
        return runAndroidLog();
    },
    task: RnvTaskName.log,
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
