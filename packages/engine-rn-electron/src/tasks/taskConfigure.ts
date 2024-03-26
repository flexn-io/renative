import { copySharedPlatforms, configureEntryPoint, RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { configureElectronProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
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
};

export default Task;
