import { configureEntryPoint, RnvTask, RnvTaskName } from '@rnv/core';
import { configureFontSources } from '@rnv/sdk-react-native';
import { configureXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';

const Task: RnvTask = {
    description: 'Configure current project',
    dependsOn: [RnvTaskName.platformConfigure],
    fn: async ({ ctx, parentTaskName }) => {
        await configureEntryPoint();

        if (ctx.program.opts().only && !!parentTaskName) {
            return true;
        }

        await configureXcodeProject();
        await configureFontSources();
    },
    task: RnvTaskName.configure,
    platforms: SdkPlatforms,
};

export default Task;
