import {
    ConfigFileProject,
    ConfigFileTemplate,
    ConfigName,
    getContext,
    inquirerPrompt,
    mergeObjects,
    readObjectSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

export const inquiryApplyTemplate = async (data: NewProjectData) => {
    const c = getContext();

    const tplName = data.optionTemplates.selectedOption;
    if (!tplName) {
        return Promise.reject('Template not selected');
    }
    const templateDir = path.join(c.paths.project.dir, 'node_modules', tplName);

    const renativeTemplateConfig =
        readObjectSync<ConfigFileTemplate>(path.join(templateDir, ConfigName.renativeTemplate)) || {};
    if (renativeTemplateConfig) {
        data.files.template.renativeTemplateConfig = renativeTemplateConfig;
    }

    const renativeConfig = readObjectSync<ConfigFileProject>(path.join(templateDir, ConfigName.renative));
    if (renativeConfig) {
        data.files.template.renativeConfig = renativeConfig;
    }

    // const templateAppConfigDir = path.join(templateDir, 'appConfigs');
    // if(fsExistsSync(templateAppConfigDir)) {
    //     read
    // }
    // const renativeAppConfig = readObjectSync<ConfigFileProject>(path.join(templateDir, ConfigName.renative));
    // if (renativeConfig) {
    //     data.files.template.renativeConfig = renativeConfig;
    // }

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

    if (!tplName) {
        return Promise.reject('Template not selected');
    }

    if (configOption === optExtend) {
        const rnvConfig = data.files.template.renativeTemplateConfig.templateConfig?.renative_json || {
            extendsTemplate: `${tplName}/renative.json`,
        };
        data.files.project.renativeConfig = { ...rnvConfig, ...data.files.project.renativeConfig };
    } else if (configOption === optCopy) {
        data.files.project.renativeConfig = {
            ...data.files.template.renativeConfig,
            ...data.files.project.renativeConfig,
        };
    }

    const packageJson = data.files.template.renativeTemplateConfig.templateConfig?.package_json || {};
    data.files.project.packageJson = mergeObjects(c, data.files.project.packageJson, packageJson);

    // const rnvNewPatchDependencies = renativeTemplateConfig.bootstrapConfig?.rnvNewPatchDependencies;

    // if (rnvNewPatchDependencies) {
    //     const patchDeps = Object.entries(rnvNewPatchDependencies);
    //     for (const [dependency, version] of patchDeps) {
    //         const command = `${isYarnInstalled() ? 'yarn' : 'npm'} add ${dependency}@${version}`;
    //         await executeAsync(command, { cwd: c.paths.project.dir });
    //     }
    // }
};
