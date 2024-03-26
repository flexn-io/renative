import { logToSummary, logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { getTemplateOptions } from '../../templates';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTemplateList');

    if (c.paths.project.configExists) {
        await executeTask(RnvTaskName.projectConfigure, RnvTaskName.templateList, originTask);
    }
    const opts = getTemplateOptions(!c.paths.project.configExists);
    logToSummary(`Templates:\n\n${opts.asString}`);
    return true;
};

const Task: RnvTask = {
    description: 'Show list of available templates',
    fn: async () => {},
    task: RnvTaskName.templateList,
    isGlobalScope: true,
};

export default Task;
