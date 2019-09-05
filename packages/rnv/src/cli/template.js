import chalk from 'chalk';
import inquirer from 'inquirer';

import {
    logTask,
} from '../common';
import { finishQuestion } from '../systemTools/prompt';
import { listTemplates, addTemplate, getTemplateOptions, getInstalledTemplateOptions, applyTemplate } from '../templateTools';

const LIST = 'list';
const ADD = 'add';
const REMOVE = 'remove';
const APPLY = 'apply';

const PIPES = {
    ADD_BEFORE: 'add:before',
    ADD_AFTER: 'add:after',
};

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case LIST:
        return _templateList(c);
    case ADD:
        return _templateAdd(c);
    case APPLY:
        return _templateApply(c);

    default:
        return Promise.reject(`cli:template Command ${c.command} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _templateList = c => new Promise((resolve, reject) => {
    logTask('_templateList');
    listTemplates(c)
        .then(() => resolve())
        .catch(e => reject(e));
});

const _templateAdd = async (c) => {
    logTask('_templateAdd');

    const opts = getTemplateOptions(c);

    const { template } = await inquirer.prompt({
        type: 'list',
        message: 'Pick which template to install',
        name: 'template',
        choices: opts.keysAsArray
    });

    addTemplate(c, template);
};

const _templateApply = async (c) => {
    logTask(`_templateApply:${c.program.template}`);

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

export { PIPES };

export default run;
