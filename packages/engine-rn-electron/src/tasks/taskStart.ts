import { runWebpackServer } from '@rnv/sdk-webpack';
import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Starts bundler / server',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        return runWebpackServer();
    },
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
