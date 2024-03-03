import {
    logTask,
    applyTemplate,
    getInstalledTemplateOptions,
    executeTask,
    PARAMS,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskRnvTemplateApply: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTemplateApply', `template: ${c.program.template}`);

    await executeTask(c, TaskKey.projectConfigure, TaskKey.templateApply, originTask);

    if (c.files.project.config?.isTemplate) {
        return Promise.reject('Template projects cannot use template apply command');
    }

    if (c.program.template) {
        await applyTemplate(c, c.program.template);
        if (c.program.appConfigID) {
            await executeTask(c, TaskKey.appConfigure, TaskKey.templateApply, originTask);
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
        await executeTask(c, TaskKey.appConfigure, TaskKey.templateApply, originTask);
    }
    return true;
};

const Task: RnvTask = {
    description: 'Reset project to specific template',
    fn: taskRnvTemplateApply,
    task: TaskKey.templateApply,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
