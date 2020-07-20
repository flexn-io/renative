/* eslint-disable import/no-cycle */
import inquirer from 'inquirer';

import {
    logTask,
} from '../core/systemManager/logger';

import { applyTemplate, getInstalledTemplateOptions } from '../core/templateManager';


export const taskRnvTemplateApply = async (c, parentTask, originTask) => {
    logTask('taskRnvTemplateApply', `parent:${parentTask} origin:${originTask} template: ${c.program.template}`);

    if (c.program.template) {
        return applyTemplate(c, c.program.template);
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
    task: 'template',
    subTask: 'apply',
    params: [],
    platforms: [],
};
