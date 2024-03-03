import { logToSummary, logTask, getTemplateOptions, executeTask, PARAMS, RnvTaskFn, RnvTask, TaskKey } from '@rnv/core';

export const taskRnvTemplateList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTemplateList');

    if (c.paths.project.configExists) {
        await executeTask(c, TaskKey.projectConfigure, TaskKey.templateList, originTask);
    }
    const opts = getTemplateOptions(c, !c.paths.project.configExists);
    logToSummary(`Templates:\n\n${opts.asString}`);
    return true;
};

const Task: RnvTask = {
    description: 'Show list of available templates',
    fn: taskRnvTemplateList,
    task: TaskKey.templateList,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
