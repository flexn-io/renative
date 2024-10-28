import { createTaskOptionsMap, createTaskOptionsPreset } from '@rnv/core';

export const TaskOptions = createTaskOptionsMap([
    {
        key: 'update-pods',
        altKey: 'updatePods',
        shortcut: 'u',
        description: 'Force update dependencies (iOS only)',
    },
    {
        key: 'keychain',
        isValueType: true,
        isRequired: true,
        description: 'Name of the keychain',
    },
    {
        key: 'provisioning-style',
        altKey: 'provisioningStyle',
        isValueType: true,
        isRequired: true,
        description: 'Set provisioningStyle (Automatic | Manual)',
    },
    {
        key: 'code-sign-identity',
        altKey: 'codeSignIdentity',
        isValueType: true,
        isRequired: true,
        description: 'Set codeSignIdentity (ie iPhone Distribution)',
    },
    {
        key: 'provision-profile-specifier',
        altKey: 'provisionProfileSpecifier',
        isValueType: true,
        isRequired: true,
        description: 'Name of provisionProfile',
    },
    {
        key: 'xcodebuild-args',
        altKey: 'xcodebuildArgs',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    {
        key: 'xcodebuild-archive-args',
        altKey: 'xcodebuildArchiveArgs',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    {
        key: 'xcodebuild-export-args',
        altKey: 'xcodebuildExportArgs',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    {
        key: 'skip-target-check',
        altKey: 'skipTargetCheck',
        description: 'Skip ios target check, just display the raw sims to choose from',
    },
    {
        key: 'filter',
        shortcut: 'f',
        isValueType: true,
        isRequired: true,
        description: 'Filter value',
    },
]);

export const TaskOptionPresets = createTaskOptionsPreset({
    withConfigure: [TaskOptions.provisioningStyle, TaskOptions.provisionProfileSpecifier, TaskOptions.codeSignIdentity],
});
