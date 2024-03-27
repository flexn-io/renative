import { RnvTaskName, RnvTaskOptionPresets, createTask } from '@rnv/core';
import { runLightningProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    dependsOn: [RnvTaskName.configure],
    description: 'Run your lightning app on target device or emulator',
    fn: async () => {
        return runLightningProject();
    },
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
});
