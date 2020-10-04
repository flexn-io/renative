import { chalk, logToSummary, logTask } from '../../core/systemManager/logger';
// import { generateOptions } from '../../cli/prompt';
import { generatePlatformChoices } from '../../core/platformManager';
import { executeTask } from '../../core/engineManager';
import { TASK_PLATFORM_LIST, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';

export const taskRnvPlatformList = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformList');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_LIST, originTask);

    const opts = generatePlatformChoices(c).map((v, i) => ` [${chalk().white(i + 1)}]> ${v.name}`);
    logToSummary(`Platforms:\n\n${opts.join('\n')}`);
    return true;
};

export default {
    description: 'List all available platforms',
    fn: taskRnvPlatformList,
    task: 'platform list',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
