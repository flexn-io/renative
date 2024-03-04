import {
    logTask,
    logRaw,
    generateOptions,
    buildHooks,
    executeTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskHooksPipes: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskHooksPipes');

    await executeTask(c, RnvTaskName.projectConfigure, RnvTaskName.hooksPipes, originTask);

    await buildHooks(c);

    const pipeOpts = generateOptions(c.buildPipes);
    logRaw(`Pipes:\n${pipeOpts.asString}`);
};

const Task: RnvTask = {
    description: 'Get the list of all available pipes',
    fn: taskHooksPipes,
    task: RnvTaskName.hooksPipes,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
