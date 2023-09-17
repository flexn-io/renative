import {
    logTask,
    logRaw,
    generateOptions,
    buildHooks,
    executeTask,
    TASK_HOOKS_PIPES,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
} from '@rnv/core';

export const taskRnvHooksPipes: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvHooksPipes');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_HOOKS_PIPES, originTask);

    await buildHooks(c);

    const pipeOpts = generateOptions(c.buildPipes);
    logRaw(`Pipes:\n${pipeOpts.asString}`);
};

export default {
    description: 'Get the list of all available pipes',
    fn: taskRnvHooksPipes,
    task: TASK_HOOKS_PIPES,
    params: PARAMS.withBase(),
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true,
};
