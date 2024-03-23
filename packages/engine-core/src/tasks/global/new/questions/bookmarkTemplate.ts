import { chalk, getContext, inquirerPrompt, logInfo, updateRenativeConfigs, writeFileSync } from '@rnv/core';
import type { NewProjectData } from '../types';

export const inquiryBookmarkTemplate = async (data: NewProjectData) => {
    const c = getContext();

    if (!data.inputs.tepmplate.name) {
        return Promise.reject('Template not selected');
    }

    const configFile = c.files.workspace.config || {};

    const defProjTemplates = c.files.rnvConfigTemplates.config?.projectTemplates || {};
    const wsProjTemplates = configFile.projectTemplates || {};

    const allKeys = Object.keys(defProjTemplates).concat(Object.keys(wsProjTemplates));

    if (!Object.keys(defProjTemplates).includes(data.inputs.tepmplate.name) || !!data.inputs.tepmplate.path) {
        const { confirmAddTemplate } = await inquirerPrompt({
            name: 'confirmAddTemplate',
            type: 'confirm',
            message: `Would you like to add ${chalk().bold(data.inputs.tepmplate.name)} to your ${
                data.optionWorkspaces.selectedOption
            } workspace template list?`,
        });

        const { templateName } = await inquirerPrompt({
            name: 'templateName',
            type: 'input',
            default: `${data.inputs.tepmplate.name} (local)`,
            validate: (v) => !allKeys.includes(v) || 'Name already exists',
            message: 'Add short description',
        });

        if (configFile) {
            if (confirmAddTemplate) {
                if (!configFile.projectTemplates) {
                    configFile.projectTemplates = {};
                }
                configFile.projectTemplates[templateName] = {
                    packageName: data.inputs.tepmplate.name,
                    localPath: data.inputs.tepmplate.path,
                    description: data.inputs.tepmplate.description,
                };
                writeFileSync(c.paths.workspace.config, configFile);
                await updateRenativeConfigs();

                logInfo(`Updating ${c.paths.workspace.config}...DONE`);
            }
        }
    }
};
