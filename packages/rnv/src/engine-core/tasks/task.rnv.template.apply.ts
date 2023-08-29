import inquirer from 'inquirer';
import { logTask } from '../../core/systemManager/logger';
import { applyTemplate, getInstalledTemplateOptions } from '../../core/templateManager';
import { executeTask } from '../../core/taskManager';
import { TASK_TEMPLATE_APPLY, TASK_PROJECT_CONFIGURE, TASK_APP_CONFIGURE, PARAMS } from '../../core/constants';
import { RnvTaskFn } from '../../core/taskManager/types';

export const taskRnvTemplateApply: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTemplateApply', `template: ${c.program.template}`);

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_APPLY, originTask);

    if (c.files.project.config.isTemplate) {
        return Promise.reject('Template projects cannot use template apply command');
    }

    if (c.program.template) {
        await applyTemplate(c, c.program.template);
        if (c.program.appConfigID) {
            await executeTask(c, TASK_APP_CONFIGURE, TASK_TEMPLATE_APPLY, originTask);
        }

        return true;
    }
    const opts = getInstalledTemplateOptions(c);

    const { template } = await inquirer.prompt({
        type: 'list',
        message: 'Pick which template to install',
        name: 'template',
        choices: opts.keysAsArray,
    });

    await applyTemplate(c, template);
    if (c.program.appConfigID) {
        await executeTask(c, TASK_APP_CONFIGURE, TASK_TEMPLATE_APPLY, originTask);
    }
    return true;
};

export default {
    description: 'Reset project to specific template',
    fn: taskRnvTemplateApply,
    task: 'template apply',
    params: PARAMS.withBase(),
    platforms: [],
};
