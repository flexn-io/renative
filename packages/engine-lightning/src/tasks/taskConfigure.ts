import { RnvTaskName, RnvTaskOptionPresets, createTask } from '@rnv/core';
import { configureLightningProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    dependsOn: [RnvTaskName.platformConfigure],
    description: 'Configure current project',
    fn: async () => {
        return configureLightningProject();
    },
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
