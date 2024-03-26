import { RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { buildElectron } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Build project binary',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        return buildElectron();
    },
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
