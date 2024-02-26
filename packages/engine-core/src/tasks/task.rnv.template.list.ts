import {
    logToSummary,
    logTask,
    getTemplateOptions,
    executeTask,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    RnvTask,
} from '@rnv/core';
import { TASK_TEMPLATE_LIST } from '../constants';

export const taskRnvTemplateList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTemplateList');

    if (c.paths.project.configExists) {
        await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_LIST, originTask);
    }
    const opts = getTemplateOptions(c, !c.paths.project.configExists);
    logToSummary(`Templates:\n\n${opts.asString}`);
    return true;
};

const Task: RnvTask = {
    description: 'Show list of available templates',
    fn: taskRnvTemplateList,
    task: TASK_TEMPLATE_LIST,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
