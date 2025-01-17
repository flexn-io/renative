import { RnvTaskName, createTask } from '@rnv/core';

/**
 * CLI command `npx rnv config` triggers this task, which is displaying RNV build config.
 * Available globally.
 */
export default createTask({
    description: 'Display RNV config',
    dependsOn: [RnvTaskName.configureSoft],
    fn: async ({ ctx }) => {
        console.log(JSON.stringify(ctx.buildConfig, null, 2));
        return true;
    },
    task: RnvTaskName.config,
});
