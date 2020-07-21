import { logTask, logRaw } from '../core/systemManager/logger';
import { generateOptions } from '../cli/prompt';
import { buildHooks } from '../core/projectManager/buildHooks';

export const taskRnvHooksPipes = async (c, parentTask, originTask) => {
    logTask('taskRnvHooksPipes', `parent:${parentTask} origin:${originTask}`);

    await buildHooks(c);

    const pipeOpts = generateOptions(c.buildPipes);
    logRaw(`Pipes:\n${pipeOpts.asString}`);
};

export default {
    description: '',
    fn: taskRnvHooksPipes,
    task: 'hooks pipes',
    params: [],
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true,
};
