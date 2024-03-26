import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { ruWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Build project binary',
    dependsOn: [RnvTaskName.package],
    fn: async () => {
        return ruWindowsProject({ release: true, launch: false, deploy: false, logging: false });
    },
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
