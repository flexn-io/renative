import { logToSummary, RnvTask, RnvTaskName } from '@rnv/core';
import { getTemplateOptions } from '../../templates';

const Task: RnvTask = {
    description: 'Show list of available templates',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const opts = getTemplateOptions(!ctx.paths.project.configExists);
        logToSummary(`Templates:\n\n${opts.asString}`);
        return true;
    },
    task: RnvTaskName.templateList,
    isGlobalScope: true,
};

export default Task;
