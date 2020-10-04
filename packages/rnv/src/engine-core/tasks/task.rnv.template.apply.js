import inquirer from 'inquirer';
import { logTask } from '../../core/systemManager/logger';
import { applyTemplate, getInstalledTemplateOptions } from '../../core/templateManager';
import { executeTask } from '../../core/engineManager';
import { TASK_TEMPLATE_APPLY, TASK_PROJECT_CONFIGURE, TASK_APP_CONFIGURE, PARAMS } from '../../core/constants';

export const taskRnvTemplateApply = async (c, parentTask, originTask) => {
    logTask('taskRnvTemplateApply', `template: ${c.program.template}`);

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_APPLY, originTask);

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
        choices: opts.keysAsArray
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
