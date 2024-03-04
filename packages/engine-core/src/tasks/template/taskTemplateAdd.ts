import {
    writeFileSync,
    logTask,
    generateBuildConfig,
    executeTask,
    RnvTaskOptionPresets,
    getTemplateOptions,
    RnvContext,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    TaskKey,
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

const taskTemplateAdd: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTemplateAdd');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.templateAdd, originTask);

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

const Task: RnvTask = {
    description: 'Install additional template to the project',
    fn: taskTemplateAdd,
    task: TaskKey.templateAdd,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
