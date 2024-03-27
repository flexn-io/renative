import { copyRuntimeAssets, createTask, generatePlatformAssetsRuntimeConfig, RnvTaskName } from '@rnv/core';
import { configureFonts } from '@rnv/sdk-utils';

export default createTask({
    description: 'Switch between different app configs in current project',
    beforeDependsOn: async ({ ctx }) => {
        ctx.program.opts().appConfigID = true;
    },
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        await copyRuntimeAssets();
        await generatePlatformAssetsRuntimeConfig();
        await configureFonts();
    },
    task: RnvTaskName.appSwitch,
});
