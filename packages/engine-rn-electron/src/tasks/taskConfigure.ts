import { copySharedPlatforms, configureEntryPoint, createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { configureElectronProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async () => {
        await configureEntryPoint();
        await copySharedPlatforms();
        return configureElectronProject();
    },
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
