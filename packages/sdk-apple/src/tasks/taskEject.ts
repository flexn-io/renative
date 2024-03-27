import { createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { ejectXcodeProject } from '../ejector';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Eject current ios project app to self contained native project',
    dependsOn: [RnvTaskName.package],
    beforeDependsOn: async ({ ctx }) => {
        ctx.runtime._platformBuildsSuffix = '_eject';
        ctx.runtime._skipNativeDepResolutions = true;
    },
    fn: async () => {
        return ejectXcodeProject();
    },
    task: RnvTaskName.eject,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
