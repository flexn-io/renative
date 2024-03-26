import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { clearWindowsTemporaryFiles, packageWindowsApp } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)
const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    dependsOn: [RnvTaskName.build],
    fn: async () => {
        await clearWindowsTemporaryFiles();
        return packageWindowsApp();
    },
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
