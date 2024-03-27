import { RnvTaskName, createTask } from '@rnv/core';

export default createTask({
    description: 'Display RNV config',
    dependsOn: [RnvTaskName.configureSoft],
    fn: async ({ ctx }) => {
        console.log(JSON.stringify(ctx.buildConfig, null, 2));
        return true;
    },
    task: RnvTaskName.config,
});
