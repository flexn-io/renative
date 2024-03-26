import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { buildWebNext } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Build project binary',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        await buildWebNext();
    },
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
