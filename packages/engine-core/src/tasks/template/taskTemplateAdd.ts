import {
    writeFileSync,
    logTask,
    generateBuildConfig,
    executeTask,
    RnvTaskOptionPresets,
    RnvContext,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { getTemplateOptions } from '../../templates';

const _writeObjectSync = (p: string, s: object) => {
    writeFileSync(p, s);
    generateBuildConfig();
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

    _writeObjectSync(c.paths.project.config, cnf);
};

const taskTemplateAdd: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTemplateAdd');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.templateAdd, originTask);

    const opts = getTemplateOptions();

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
    task: RnvTaskName.templateAdd,
    options: RnvTaskOptionPresets.withBase(),
};

export default Task;
