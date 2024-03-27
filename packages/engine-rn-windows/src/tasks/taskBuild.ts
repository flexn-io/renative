import { RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { ruWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Build project binary',
    dependsOn: [RnvTaskName.package],
    fn: async () => {
        return ruWindowsProject({ release: true, launch: false, deploy: false, logging: false });
    },
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
