import { chalk, getContext, inquirerPrompt, logInfo, writeFileSync } from '@rnv/core';
import type { NewProjectData } from '../types';

const Question = async (data: NewProjectData) => {
    const c = getContext();

    const { inputs } = data;

    if (!inputs.template?.packageName) {
        return Promise.reject('Template not selected');
    }

    const configFile = c.files.workspace.config || { workspace: {} };
    // const defProjTemplates = c.files.rnvConfigTemplates.config?.projectTemplates || {};
    // const wsProjTemplates = configFile.projectTemplates || {};
    const projTemplates = c.buildConfig.projectTemplates || {};
    const allKeys = Object.keys(projTemplates);

    if (
        (!allKeys.includes(inputs.template.packageName) || !!inputs.template.localPath) &&
        inputs.template.type !== 'existing'
    ) {
        const { confirmAddTemplate } = await inquirerPrompt({
            name: 'confirmAddTemplate',
            type: 'confirm',
            message: `Would you like to add ${chalk().bold.white(inputs.template.packageName)} to your ${
                inputs.workspaceID
            } workspace template list?`,
        });

        const { templateName } = await inquirerPrompt({
            name: 'templateName',
            type: 'input',
            default: `${inputs.template.packageName} (local)`,
            validate: (v) => !allKeys.includes(v) || 'Name already exists',
            message: 'Add short description',
        });

        if (configFile) {
            if (confirmAddTemplate) {
                if (!configFile.workspace) {
                    configFile.workspace = {};
                }
                if (!configFile.workspace.projectTemplates) {
                    configFile.workspace.projectTemplates = {};
                }
                configFile.workspace.projectTemplates[templateName] = {
                    packageName: inputs.template.packageName,
                    localPath: inputs.template.localPath,
                    description: inputs.template.description,
                };
                writeFileSync(c.paths.workspace.config, configFile);

                logInfo(`Updating ${c.paths.workspace.config}...DONE`);
            }
        }
    }
};

export default Question;
