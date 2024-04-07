import { runWebpackServer } from '@rnv/sdk-webpack';
import { RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Starts bundler / server',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        return runWebpackServer();
    },
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
