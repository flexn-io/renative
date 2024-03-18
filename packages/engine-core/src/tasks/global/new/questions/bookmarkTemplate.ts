import { chalk, getContext, inquirerPrompt, logInfo, updateRenativeConfigs, writeFileSync } from '@rnv/core';
import type { NewProjectData } from '../types';

export const inquiryBookmarkTemplate = async (data: NewProjectData) => {
    const c = getContext();

    if (!data.optionTemplates.selectedOption) {
        return Promise.reject('Template not selected');
    }

    if (!data.optionTemplates.keysAsArray?.includes(data.optionTemplates.selectedOption)) {
        const { confirmAddTemplate } = await inquirerPrompt({
            name: 'confirmAddTemplate',
            type: 'confirm',
            message: `Would you like to add ${chalk().bold(data.optionTemplates.selectedOption)} to your ${
                c.runtime.selectedWorkspace
            } workspace template list?`,
        });

        const { templateDescription } = await inquirerPrompt({
            name: 'templateDescription',
            type: 'input',
            default: 'Custom template added by user',
            message: 'Add short description',
        });

        const configFile = c.files.workspace.config;

        if (configFile) {
            if (confirmAddTemplate) {
                if (!configFile.projectTemplates) {
                    configFile.projectTemplates = {};
                }
                configFile.projectTemplates[data.optionTemplates.selectedOption] = {
                    description: templateDescription,
                };
                writeFileSync(c.paths.workspace.config, configFile);
                await updateRenativeConfigs();

                logInfo(`Updating ${c.paths.workspace.config}...DONE`);
            }
        }
    }
};
