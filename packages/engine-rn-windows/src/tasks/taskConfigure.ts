import { copySharedPlatforms, RnvTaskOptionPresets, configureEntryPoint, RnvTask, RnvTaskName } from '@rnv/core';
import { configureWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async () => {
        await configureEntryPoint();
        await copySharedPlatforms();
        return configureWindowsProject();
    },
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
