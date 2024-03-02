import { logTask, logRaw, generateOptions, buildHooks, executeTask, PARAMS, RnvTaskFn, RnvTask } from '@rnv/core';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';
import { TASK_HOOKS_PIPES } from './constants';

export const taskRnvHooksPipes: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvHooksPipes');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_HOOKS_PIPES, originTask);

    await buildHooks(c);

    const pipeOpts = generateOptions(c.buildPipes);
    logRaw(`Pipes:\n${pipeOpts.asString}`);
};

const Task: RnvTask = {
    description: 'Get the list of all available pipes',
    fn: taskRnvHooksPipes,
    task: TASK_HOOKS_PIPES,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
