import { createTask, RnvTaskName } from '@rnv/core';
import { configureFontSources } from '@rnv/sdk-react-native';
import { configureXcodeProject } from '../runner';
import { SdkPlatforms, SDKTaskOptionPresets } from '../common';

export default createTask({
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async ({ ctx, parentTaskName }) => {
        if (ctx.program.opts().only && !!parentTaskName) {
            return true;
        }
        await configureXcodeProject();
        await configureFontSources();
    },
    options: SDKTaskOptionPresets.withConfigure(),
    task: RnvTaskName.configure,
    platforms: SdkPlatforms,
});
