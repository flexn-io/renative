import inquirer from 'inquirer';
import { writeFileSync } from '../../core/systemManager/fileutils';
import { logTask } from '../../core/systemManager/logger';
import { generateBuildConfig } from '../../core/configManager';
import { executeTask } from '../../core/taskManager';
import { TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_ADD, PARAMS } from '../../core/constants';

import { getTemplateOptions } from '../../core/templateManager';
import { RnvContext } from '../../core/configManager/types';
import { RnvTaskFn } from '../../core/taskManager/types';

const _writeObjectSync = (c: RnvContext, p: string, s: string) => {
    writeFileSync(p, s);
    generateBuildConfig(c);
};

export const _addTemplate = (c: RnvContext, template: string) => {
    logTask('addTemplate');

    c.files.project.config.templates = c.files.project.config.templates || {};

    if (!c.files.project.config.templates[template]) {
        c.files.project.config.templates[template] = {
            version: 'latest',
        };
    }

    _writeObjectSync(c, c.paths.project.config, c.files.project.config);
};

export const taskRnvTemplateAdd: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTemplateAdd');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_ADD, originTask);

    const opts = getTemplateOptions(c);

    const { template } = await inquirer.prompt({
        type: 'list',
        message: 'Pick which template to install',
        name: 'template',
        choices: opts.keysAsArray,
    });

    _addTemplate(c, template);

    return true;
};

export default {
    description: 'Install additional template to the project',
    fn: taskRnvTemplateAdd,
    task: 'template add',
    params: PARAMS.withBase(),
    platforms: [],
};
