import { logRaw, generateOptions, buildHooks, createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Get the list of all available pipes',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        await buildHooks();

        const pipeOpts = generateOptions(ctx.buildPipes);
        logRaw(`Pipes:\n${pipeOpts.asString}`);
    },
    task: RnvTaskName.hooksPipes,
});
