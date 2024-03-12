import {
    chalk,
    executeAsync,
    fsExistsSync,
    getContext,
    getTemplateOptions,
    inquirerPrompt,
    isYarnInstalled,
    listAndSelectNpmVersion,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';
import { checkInputValue } from '../utils';

export const inquiryInstallTemplate = async (data: NewProjectData) => {
    const customTemplate = 'Custom Template ...';

    const c = getContext();
    const { templateVersion, projectTemplate } = c.program;

    data.optionTemplates = getTemplateOptions();

    const options = [];
    const values = data.optionTemplates.valuesAsObject;
    if (values) {
        Object.keys(values).forEach((k) => {
            const val = values[k];
            if (val.description) {
                val.title = `${k} ${chalk().grey(`- ${val.description}`)}`;
            } else {
                val.title = k;
            }

            val.key = k;
            options.push(val.title);
        });
    }

    const getTemplateKey = (val: string) => data.optionTemplates.valuesAsArray?.find((v) => v.title === val)?.key;

    // data.optionTemplates.keysAsArray.push(customTemplate);
    options.push(customTemplate);
    let selectedInputTemplate;
    if (checkInputValue(projectTemplate)) {
        selectedInputTemplate = projectTemplate;
    } else {
        const { inputTemplate } = await inquirerPrompt({
            name: 'inputTemplate',
            type: 'list',
            message: 'What template to use?',
            default: data.defaultTemplate,
            choices: options,
        });

        if (inputTemplate === customTemplate) {
            const { inputTemplateCustom } = await inquirerPrompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'Type exact name of your template NPM package.',
            });
            selectedInputTemplate = inputTemplateCustom;
        } else {
            selectedInputTemplate = getTemplateKey(inputTemplate);
        }
    }

    data.optionTemplates.selectedOption = selectedInputTemplate;

    let inputTemplateVersion;
    if (checkInputValue(templateVersion)) {
        inputTemplateVersion = templateVersion;
    } else {
        inputTemplateVersion = await listAndSelectNpmVersion(data.optionTemplates.selectedOption || '');
    }

    data.optionTemplates.selectedVersion = inputTemplateVersion;

    await executeAsync(
        `${isYarnInstalled() ? 'yarn' : 'npm'} add ${selectedInputTemplate}@${inputTemplateVersion} --dev`,
        {
            cwd: c.paths.project.dir,
        }
    );

    // Add rnv to package.json
    // await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add rnv@${c.rnvVersion}`, {
    //     cwd: c.paths.project.dir,
    // });

    // Check if node_modules folder exists
    if (!fsExistsSync(path.join(c.paths.project.dir, 'node_modules'))) {
        return Promise.reject(
            `${
                isYarnInstalled() ? 'yarn' : 'npm'
            } add ${selectedInputTemplate}@${inputTemplateVersion} : FAILED. this could happen if you have package.json accidentally created somewhere in parent directory`
        );
    }
};
