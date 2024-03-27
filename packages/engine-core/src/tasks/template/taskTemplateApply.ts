import {
    applyTemplate,
    getInstalledTemplateOptions,
    executeTask,
    inquirerPrompt,
    createTask,
    RnvTaskName,
} from '@rnv/core';

export default createTask({
    description: 'Reset project to specific template',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx, taskName, originTaskName }) => {
        const { buildConfig, program } = ctx;
        if (buildConfig?.isTemplate) {
            return Promise.reject('Template projects cannot use template apply command');
        }

        if (program.opts().template) {
            await applyTemplate(program.opts().template);
            if (program.opts().appConfigID) {
                await executeTask({ taskName: RnvTaskName.appConfigure, parentTaskName: taskName, originTaskName });
            }

            return true;
        }
        const opts = await getInstalledTemplateOptions();

        const { template } = await inquirerPrompt({
            type: 'list',
            message: 'Pick which template to install',
            name: 'template',
            choices: opts?.keysAsArray,
        });

        await applyTemplate(template);
        if (program.opts().appConfigID) {
            await executeTask({ taskName: RnvTaskName.appConfigure, parentTaskName: taskName, originTaskName });
        }
        return true;
    },
    task: RnvTaskName.templateApply,
});
