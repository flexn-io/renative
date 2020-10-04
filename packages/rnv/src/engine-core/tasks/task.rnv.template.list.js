import { logToSummary, logTask } from '../../core/systemManager/logger';
import { getTemplateOptions } from '../../core/templateManager';
import { executeTask } from '../../core/engineManager';
import { TASK_TEMPLATE_LIST, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';

export const taskRnvTemplateList = async (c, parentTask, originTask) => {
    logTask('taskRnvTemplateList');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_LIST, originTask);

    const opts = getTemplateOptions(c);
    logToSummary(`Templates:\n\n${opts.asString}`);
    return true;
};

export default {
    description: 'Show list of available templates',
    fn: taskRnvTemplateList,
    task: 'template list',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
