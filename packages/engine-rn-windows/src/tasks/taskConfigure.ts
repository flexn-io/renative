import { copySharedPlatforms, RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { configureWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async () => {
        await copySharedPlatforms();
        return configureWindowsProject();
    },
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
