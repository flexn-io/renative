import { RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { exportXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Export the app into deployable binary',
    dependsOn: [RnvTaskName.build],
    fn: async () => {
        return exportXcodeProject();
    },
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
