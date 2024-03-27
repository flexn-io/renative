import { createTask, RnvTaskName } from '@rnv/core';
import { runAppleLog } from '../runner';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Attach logger to device or emulator and print out logs',
    dependsOn: [RnvTaskName.workspaceConfigure],
    fn: async () => {
        return runAppleLog();
    },
    task: RnvTaskName.log,
    platforms: SdkPlatforms,
    isGlobalScope: true,
});
