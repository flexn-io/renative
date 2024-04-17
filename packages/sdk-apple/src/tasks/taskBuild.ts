import { createTask, RnvTaskName } from '@rnv/core';
import { buildXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';
import { TaskOptionPresets, TaskOptions } from '../taskOptions';

export default createTask({
    description: 'Build project binary',
    dependsOn: [RnvTaskName.package],
    fn: async ({ parentTaskName }) => {
        if (parentTaskName === RnvTaskName.export) {
            // build task is not necessary when exporting ios
            return true;
        }
        return buildXcodeProject();
    },
    task: RnvTaskName.build,
    options: TaskOptionPresets.withConfigure([TaskOptions.xcodebuildArgs]),
    platforms: SdkPlatforms,
});
