import { getContext, inquirerPrompt, mergeObjects } from '@rnv/core';
import type { NewProjectData } from '../types';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { inputs, files } = data;

    const tplName = inputs.template?.packageName;
    if (!tplName) {
        return Promise.reject('Template not selected');
    }

    const optExtend = 'Extend template (cleaner, overridable)';
    const optCopy = 'Copy from template (full control)';
    const options = [optExtend, optCopy];
    const { configOption } = await inquirerPrompt({
        name: 'configOption',
        type: 'list',
        message: 'How to create config?',
        default: optExtend,
        choices: options,
    });

    if (!tplName) {
        return Promise.reject('Template not selected');
    }

    if (configOption === optExtend) {
        const rnvConfig = files.template.renativeTemplateConfig?.template?.templateConfig?.renative_json || {
            extendsTemplate: `${tplName}/rnv.json`,
        };

        if (rnvConfig?.$schema) {
            const { $schema, ...restRnvConfig } = rnvConfig;
            const projectConfig = {
                $schema,
                project: {
                    ...restRnvConfig,
                    ...files.project.renativeConfig.project,
                },
            };
            files.project.renativeConfig = {
                ...files.project.renativeConfig,
                ...projectConfig,
            };
        } else {
            files.project.renativeConfig = {
                ...files.project.renativeConfig,
                project: {
                    ...files.project.renativeConfig.project,
                    ...rnvConfig,
                },
            };
        }
    } else if (configOption === optCopy) {
        files.project.renativeConfig = {
            ...files.template.renativeConfig,
            ...files.project.renativeConfig,
        };
    }

    const packageJson = files.template.renativeTemplateConfig?.template.templateConfig?.package_json || {};
    files.project.packageJson = mergeObjects(c, files.project.packageJson, packageJson);
};

export default Question;
