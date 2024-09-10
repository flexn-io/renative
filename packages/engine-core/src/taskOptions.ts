import { createTaskOptionsMap } from '@rnv/core';

export const TaskOptions = createTaskOptionsMap([
    {
        key: 'key',
        shortcut: 'k',
        isValueType: true,
        isRequired: true,
        description: 'Pass the key/password',
    },
    {
        key: 'git-enabled',
        altKey: 'gitEnabled',
        description: 'Enable git in your newly created project',
        isValueType: true,
    },
    {
        key: 'answer',
        isValueType: true,
        isVariadic: true,
        description: 'Pass in answers to prompts',
        examples: ['--answer question=response question2=response2', '--answer question=\'{"some": "json"}\''],
    },
    {
        key: 'workspace',
        isValueType: true,
        description: 'select the workspace for the new project',
    },
    {
        key: 'template',
        shortcut: 'T',
        isValueType: true,
        isRequired: true,
        description: 'select specific template',
    },
    {
        key: 'project-name',
        altKey: 'projectName',
        isValueType: true,
        description: 'select the name of the new project',
    },
    {
        key: 'project-template',
        altKey: 'projectTemplate',
        isValueType: true,
        description: 'select the template of new project',
    },
    {
        key: 'template-version',
        altKey: 'templateVersion',
        isValueType: true,
        description: 'select the template version',
    },
    {
        key: 'local-template-path',
        altKey: 'localTemplatePath',
        isValueType: true,
        description: 'select the local template path (absolute)',
    },
    {
        key: 'title',
        isValueType: true,
        description: 'select the title of the app',
    },
    {
        key: 'app-version',
        altKey: 'appVersion',
        isValueType: true,
        description: 'select the version of the app',
    },
    {
        key: 'id',
        isValueType: true,
        description: 'select the id of the app',
    },
]);
