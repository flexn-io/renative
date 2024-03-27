import { RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';
import { clearWindowsTemporaryFiles, ruWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Run your app in a window on desktop',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ originTaskName }) => {
        await clearWindowsTemporaryFiles();
        await startBundlerIfRequired(RnvTaskName.run, originTaskName);
        await ruWindowsProject();
        return waitForBundlerIfRequired();
    },
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
});
