import { applyTemplate, createTask, RnvTaskName, logInfo, inquirerPrompt } from '@rnv/core';

export default createTask({
    description: 'Reapply template (if configured) to current project',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const { buildConfig } = ctx;
        if (buildConfig?.isTemplate) {
            return Promise.reject('Template projects cannot use template apply command');
        }
        logInfo(
            'This command will reapply template to current project. files will be overwritten. make sure you backed up your project before proceeding.'
        );
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Proceed?',
        });
        if (!confirm) {
            return;
        }
        return applyTemplate();
    },
    task: RnvTaskName.templateApply,
});
