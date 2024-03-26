import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { exportWebNext } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        return exportWebNext();
    },
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
