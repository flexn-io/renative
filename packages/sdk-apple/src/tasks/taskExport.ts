import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { exportXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    dependsOn: [RnvTaskName.build],
    fn: async () => {
        return exportXcodeProject();
    },
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
