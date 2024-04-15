import { RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { configureNextIfRequired } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async () => {
        return configureNextIfRequired();
    },
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
