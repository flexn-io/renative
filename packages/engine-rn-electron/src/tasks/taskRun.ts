import { RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { runElectron } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Run your electron app on your machine',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        return runElectron();
    },
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
};

export default Task;
