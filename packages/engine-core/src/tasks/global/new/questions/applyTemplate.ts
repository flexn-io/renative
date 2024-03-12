import {
    ConfigFileProject,
    ConfigFileTemplate,
    ConfigName,
    getContext,
    inquirerPrompt,
    readObjectSync,
    writeFileSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

export const inquiryApplyTemplate = async (data: NewProjectData) => {
    const c = getContext();

    if (!data.optionTemplates.selectedOption) {
        return Promise.reject('Template not selected');
    }
    const templateDir = path.join(c.paths.project.dir, 'node_modules', data.optionTemplates.selectedOption);

    const renativeTemplateConfig =
        readObjectSync<ConfigFileTemplate>(path.join(templateDir, ConfigName.renativeTemplate)) || {};
    if (renativeTemplateConfig) {
        data.files.template.renativeTemplateConfig = renativeTemplateConfig;
    }

    const renativeConfig = readObjectSync<ConfigFileProject>(path.join(templateDir, ConfigName.renative));
    if (renativeConfig) {
        data.files.template.renativeConfig = renativeConfig;
    }

    const optExtend = 'Extend template (cleaner, overridable)';
    const optCopy = 'Copy from template (full control)';
    const options = [optExtend, optCopy];
    const { configOption } = await inquirerPrompt({
        name: 'configOption',
        type: 'list',
        message: 'How to create config renative.json?',
        default: data.defaultTemplate,
        choices: options,
    });

    if (configOption === optExtend) {
        const rnvConfig = data.files.template.renativeTemplateConfig.templateConfig?.renative_json || {
            extendsTemplate: `${data.optionTemplates.selectedOption}/renative.json`,
        };
        writeFileSync(c.paths.project.config, rnvConfig);
    } else if (configOption === optCopy) {
        writeFileSync(c.paths.project.config, data.files.template.renativeConfig);
    }

    // const rnvNewPatchDependencies = renativeTemplateConfig.bootstrapConfig?.rnvNewPatchDependencies;

    // if (rnvNewPatchDependencies) {
    //     const patchDeps = Object.entries(rnvNewPatchDependencies);
    //     for (const [dependency, version] of patchDeps) {
    //         const command = `${isYarnInstalled() ? 'yarn' : 'npm'} add ${dependency}@${version}`;
    //         await executeAsync(command, { cwd: c.paths.project.dir });
    //     }
    // }
};
