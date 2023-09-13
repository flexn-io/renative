import {
    logToSummary,
    logTask,
    getTemplateOptions,
    executeTask,
    TASK_TEMPLATE_LIST,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
} from 'rnv';

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
