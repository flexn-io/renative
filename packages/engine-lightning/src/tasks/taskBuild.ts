import { RnvTaskName, RnvTaskOptionPresets, createTask } from '@rnv/core';
import { buildLightningProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Build project binary',
    fn: async () => {
        return buildLightningProject();
    },
    task: RnvTaskName.build,
    dependsOn: [RnvTaskName.configure],
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
