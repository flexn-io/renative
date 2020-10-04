import { logTask, logRaw } from '../../core/systemManager/logger';
import { generateOptions } from '../../cli/prompt';
import { buildHooks } from '../../core/projectManager/buildHooks';
import { executeTask } from '../../core/engineManager';
import { TASK_HOOKS_PIPES, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


export const taskRnvHooksPipes = async (c, parentTask, originTask) => {
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
