import { logRaw, generateOptions, buildHooks, RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'Get the list of all available pipes',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        await buildHooks();

        const pipeOpts = generateOptions(ctx.buildPipes);
        logRaw(`Pipes:\n${pipeOpts.asString}`);
    },
    task: RnvTaskName.hooksPipes,
};

export default Task;
