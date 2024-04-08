import { createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { exportElectron } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Export the app into deployable binary',
    dependsOn: [RnvTaskName.build],
    fn: async () => {
        return exportElectron();
    },
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
