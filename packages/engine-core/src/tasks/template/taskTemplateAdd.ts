import {
    writeFileSync,
    logTask,
    generateBuildConfig,
    RnvContext,
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

const Task: RnvTask = {
    description: 'Install additional template to the project',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const opts = getTemplateOptions();

        const { template } = await inquirerPrompt({
            type: 'list',
            message: 'Pick which template to install',
            name: 'template',
            choices: opts.keysAsArray,
        });

        _addTemplate(ctx, template);

        return true;
    },
    task: RnvTaskName.templateAdd,
};

export default Task;
