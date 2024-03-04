import {
    logTask,
    logRaw,
    generateOptions,
    buildHooks,
    executeTask,
    PARAMS,
    RnvTaskFn,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskHooksPipes: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskHooksPipes');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.hooksPipes, originTask);

    await buildHooks(c);

    const pipeOpts = generateOptions(c.buildPipes);
    logRaw(`Pipes:\n${pipeOpts.asString}`);
};

const Task: RnvTask = {
    description: 'Get the list of all available pipes',
    fn: taskHooksPipes,
    task: TaskKey.hooksPipes,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
