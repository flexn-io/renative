import inquirer from 'inquirer';
import { logTask } from '../core/systemManager/logger';
import { applyTemplate, getInstalledTemplateOptions } from '../core/templateManager';
import { executeTask } from '../core/engineManager';
import { TASK_TEMPLATE_APPLY, TASK_PROJECT_CONFIGURE } from '../core/constants';

export const taskRnvTemplateApply = async (c, parentTask, originTask) => {
    logTask('taskRnvTemplateApply', `parent:${parentTask} origin:${originTask} template: ${c.program.template}`);

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_APPLY, originTask);

    if (c.program.template) {
        await applyTemplate(c, c.program.template);
    }
    const opts = getInstalledTemplateOptions(c);

    const { template } = await inquirer.prompt({
        type: 'list',
        message: 'Pick which template to install',
        name: 'template',
        choices: opts.keysAsArray
    });

    applyTemplate(c, template);
};

export default {
    description: '',
    fn: taskRnvTemplateApply,
    task: 'template apply',
    params: [],
    platforms: [],
};
