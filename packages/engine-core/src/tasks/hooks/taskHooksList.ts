import { logToSummary, generateOptions, buildHooks, RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'Get list of all available hooks',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        await buildHooks();

        if (ctx.buildHooks) {
            const hookOpts = generateOptions(ctx.buildHooks);
            let hooksAsString = `\n${'Hooks:'}\n${hookOpts.asString}`;

            if (ctx.buildPipes) {
                const pipeOpts = generateOptions(ctx.buildPipes);
                hooksAsString += `\n${'Pipes:'}\n${pipeOpts.asString}`;
            }
            logToSummary(hooksAsString);
            return;
        }
        return Promise.reject('Your buildHooks object is empty!');
    },
    task: RnvTaskName.hooksList,
    forceBuildHookRebuild: true,
};

export default Task;
