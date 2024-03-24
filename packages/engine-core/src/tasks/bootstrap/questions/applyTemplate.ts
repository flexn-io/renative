import {
    ConfigFileProject,
    ConfigFileTemplate,
    RnvFileName,
    getContext,
    inquirerPrompt,
    mergeObjects,
    readObjectSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { inputs, files } = data;

    const tplName = inputs.tepmplate?.packageName;
    if (!tplName) {
        return Promise.reject('Template not selected');
    }
    const templateDir = path.join(c.paths.project.dir, 'node_modules', tplName);

    const renativeTemplateConfig =
        readObjectSync<ConfigFileTemplate>(path.join(templateDir, RnvFileName.renativeTemplate)) || {};
    if (renativeTemplateConfig) {
        files.template.renativeTemplateConfig = renativeTemplateConfig;
    }

    const renativeConfig = readObjectSync<ConfigFileProject>(path.join(templateDir, RnvFileName.renative));
    if (renativeConfig) {
        files.template.renativeConfig = renativeConfig;
    }

    const optExtend = 'Extend template (cleaner, overridable)';
    const optCopy = 'Copy from template (full control)';
    const options = [optExtend, optCopy];
    const { configOption } = await inquirerPrompt({
        name: 'configOption',
        type: 'list',
        message: 'How to create config renative.json?',
        default: optExtend,
        choices: options,
    });

    if (!tplName) {
        return Promise.reject('Template not selected');
    }

    if (configOption === optExtend) {
        const rnvConfig = files.template.renativeTemplateConfig.templateConfig?.renative_json || {
            extendsTemplate: `${tplName}/renative.json`,
        };
        files.project.renativeConfig = { ...rnvConfig, ...files.project.renativeConfig };
    } else if (configOption === optCopy) {
        files.project.renativeConfig = {
            ...files.template.renativeConfig,
            ...files.project.renativeConfig,
        };
    }

    const packageJson = files.template.renativeTemplateConfig.templateConfig?.package_json || {};
    files.project.packageJson = mergeObjects(c, files.project.packageJson, packageJson);
};

export default Question;
