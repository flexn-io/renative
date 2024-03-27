import { createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { buildElectron } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Build project binary',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        return buildElectron();
    },
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
