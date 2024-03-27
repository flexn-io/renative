import { logToSummary, createTask, RnvTaskName } from '@rnv/core';
import { getTemplateOptions } from '../../templates';

export default createTask({
    description: 'Show list of available templates',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const opts = getTemplateOptions(!ctx.paths.project.configExists);
        logToSummary(`Templates:\n\n${opts.asString}`);
        return true;
    },
    task: RnvTaskName.templateList,
    isGlobalScope: true,
});
