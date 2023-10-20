import {
    writeFileSync,
    logTask,
    generateBuildConfig,
    executeTask,
    TASK_PROJECT_CONFIGURE,
    TASK_TEMPLATE_ADD,
    PARAMS,
    getTemplateOptions,
    RnvContext,
    RnvTaskFn,
    inquirerPrompt,
} from '@rnv/core';

const _writeObjectSync = (c: RnvContext, p: string, s: object) => {
    writeFileSync(p, s);
    generateBuildConfig(c);
};

export const _addTemplate = (c: RnvContext, template: string) => {
    logTask('addTemplate');

    const cnf = c.files.project.config;
    if (!cnf) return;

    cnf.templates = cnf.templates || {};

    if (!cnf.templates[template]) {
        cnf.templates[template] = {
            version: 'latest',
        };
    }

    _writeObjectSync(c, c.paths.project.config, cnf);
};

export const taskRnvTemplateAdd: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTemplateAdd');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_TEMPLATE_ADD, originTask);

    const opts = getTemplateOptions(c);

    const { template } = await inquirerPrompt({
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
