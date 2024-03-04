import {
    logTask,
    applyTemplate,
    getInstalledTemplateOptions,
    executeTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskTemplateApply: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTemplateApply', `template: ${c.program.template}`);

    await executeTask(c, RnvTaskName.projectConfigure, RnvTaskName.templateApply, originTask);

    if (c.files.project.config?.isTemplate) {
        return Promise.reject('Template projects cannot use template apply command');
    }

    if (c.program.template) {
        await applyTemplate(c, c.program.template);
        if (c.program.appConfigID) {
            await executeTask(c, RnvTaskName.appConfigure, RnvTaskName.templateApply, originTask);
        }

        return true;
    }
    const opts = getInstalledTemplateOptions(c);

    const { template } = await inquirerPrompt({
        type: 'list',
        message: 'Pick which template to install',
        name: 'template',
        choices: opts?.keysAsArray,
    });

    await applyTemplate(c, template);
    if (c.program.appConfigID) {
        await executeTask(c, RnvTaskName.appConfigure, RnvTaskName.templateApply, originTask);
    }
    return true;
};

const Task: RnvTask = {
    description: 'Reset project to specific template',
    fn: taskTemplateApply,
    task: RnvTaskName.templateApply,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
