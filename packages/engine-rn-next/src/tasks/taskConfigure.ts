import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { configureNextIfRequired } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async () => {
        return configureNextIfRequired();
    },
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
