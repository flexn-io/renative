/* eslint-disable import/no-cycle */
import inquirer from 'inquirer';

import {
    logTask,
} from '../systemManager/logger';

import { applyTemplate, getInstalledTemplateOptions } from '../templateManager';


export const rnvTemplateApply = async (c) => {
    logTask(`rnvTemplateApply:${c.program.template}`);

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
