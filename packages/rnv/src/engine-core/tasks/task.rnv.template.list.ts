import { logToSummary, logTask } from '../../core/systemManager/logger';
import { getTemplateOptions } from '../../core/templateManager';
import { executeTask } from '../../core/taskManager';
import { TASK_TEMPLATE_LIST, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { RnvTaskFn } from '../../core/taskManager/types';

export const taskRnvTemplateList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTemplateList');

    if (c.paths.project.configExists) {
        await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_LIST, originTask);
    }
    const opts = getTemplateOptions(c, !c.paths.project.configExists);
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
    isGlobalScope: true,
};
