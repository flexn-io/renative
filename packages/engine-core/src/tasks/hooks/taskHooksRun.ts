import {
    buildHooks,
    executeTask,
    fsExistsSync,
    inquirerPrompt,
    logInfo,
    createTask,
    RnvTaskName,
    RnvTaskOptions,
} from '@rnv/core';

export default createTask({
    description: 'Run specific build hook',
    // dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx, taskName, originTaskName }) => {
        if (fsExistsSync(ctx.paths.project.config)) {
            await executeTask({ taskName: RnvTaskName.projectConfigure, parentTaskName: taskName, originTaskName });
        } else {
            logInfo('Your are running your buildHook outside of renative project. SKIPPING project configure');
        }

        await buildHooks();

        if (!ctx.buildHooks) {
            return Promise.reject('Build hooks have not been compiled properly!');
        }

        let hookName = ctx.program?.opts()?.exeMethod;
        let showHookList = false;

        if (!hookName || hookName === true) {
            showHookList = true;
        } else if (!ctx.buildHooks[hookName]) {
            showHookList = true;
        }

        if (Object.keys(ctx.buildHooks).length === 0) {
            return true;
        }

        if (showHookList) {
            const hooksList = Object.keys(ctx.buildHooks);

            const { selectedHook } = await inquirerPrompt({
                name: 'selectedHook',
                type: 'list',
                message: 'Pick an available hook:',
                choices: hooksList,
            });
            hookName = selectedHook;
        }
        await ctx.buildHooks[hookName](ctx);

        return true;
    },
    task: RnvTaskName.hooksRun,
    options: [RnvTaskOptions.exeMethod],
    forceBuildHookRebuild: true,
    isGlobalScope: true,
});
