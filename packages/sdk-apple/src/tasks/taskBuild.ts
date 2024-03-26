import { RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { buildXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';

const Task: RnvTask = {
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
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
