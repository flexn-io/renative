import {
    ConfigFileProject,
    ConfigFileTemplate,
    ConfigName,
    chalk,
    executeAsync,
    fsExistsSync,
    getContext,
    getTemplateOptions,
    inquirerPrompt,
    isYarnInstalled,
    listAndSelectNpmVersion,
    logError,
    logInfo,
    readObjectSync,
    updateRenativeConfigs,
    writeFileSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';
import { checkInputValue } from '../utils';

export const inquiryTemplate = async (data: NewProjectData) => {
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

    await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add ${selectedInputTemplate}@${inputTemplateVersion}`, {
        cwd: c.paths.project.dir,
    });

    // Add rnv to package.json
    await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add rnv@${c.rnvVersion}`, {
        cwd: c.paths.project.dir,
    });

    // Check if node_modules folder exists
    if (!fsExistsSync(path.join(c.paths.project.dir, 'node_modules'))) {
        logError(
            `${
                isYarnInstalled() ? 'yarn' : 'npm'
            } add ${selectedInputTemplate}@${inputTemplateVersion} : FAILED. this could happen if you have package.json accidentally created somewhere in parent directory`
        );
        return;
    }
    // This ensures that the correct version of the npm packages will be used to run the project for the first time after creation

    const renativeTemplateConfig =
        readObjectSync<ConfigFileTemplate>(
            path.join(c.paths.project.dir, 'node_modules', selectedInputTemplate, ConfigName.renativeTemplate)
        ) || {};

    const rnvNewPatchDependencies = renativeTemplateConfig.bootstrapConfig?.rnvNewPatchDependencies;

    if (rnvNewPatchDependencies) {
        const patchDeps = Object.entries(rnvNewPatchDependencies);
        for (const [dependency, version] of patchDeps) {
            const command = `${isYarnInstalled() ? 'yarn' : 'npm'} add ${dependency}@${version}`;
            await executeAsync(command, { cwd: c.paths.project.dir });
        }
    }

    if (!data.optionTemplates.keysAsArray?.includes(selectedInputTemplate)) {
        const { confirmAddTemplate } = await inquirerPrompt({
            name: 'confirmAddTemplate',
            type: 'confirm',
            message: `Would you like to add ${chalk().bold(selectedInputTemplate)} to your ${
                c.runtime.selectedWorkspace
            } workspace template list?`,
        });

        const configFile = c.files.workspace.config;

        if (configFile) {
            if (confirmAddTemplate) {
                if (!configFile.projectTemplates) {
                    configFile.projectTemplates = {};
                }
                configFile.projectTemplates[selectedInputTemplate] = {};
                writeFileSync(c.paths.workspace.config, configFile);
                await updateRenativeConfigs();

                logInfo(`Updating ${c.paths.workspace.config}...DONE`);
            }
        }
    }

    data.renativeTemplateConfig = renativeTemplateConfig;

    const renativeConfig = readObjectSync<ConfigFileProject>(
        path.join(c.paths.project.dir, 'node_modules', selectedInputTemplate, ConfigName.renative)
    );
    if (renativeConfig) {
        data.renativeConfig = renativeConfig;
    }
};
