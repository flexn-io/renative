import { createTask, RnvTaskName, RnvTaskOptions } from '@rnv/core';
import { exportXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';
import { TaskOptionPresets, TaskOptions } from '../taskOptions';

export default createTask({
    description: 'Export the app into deployable binary',
    dependsOn: [RnvTaskName.build],
    fn: async () => {
        return exportXcodeProject();
    },
    task: RnvTaskName.export,
    options: [...TaskOptionPresets.withConfigure([TaskOptions.xcodebuildExportArgs]), RnvTaskOptions.appConfigID],
    platforms: SdkPlatforms,
});
