import { createTaskOptionsMap, createTaskOptionsPreset } from '@rnv/core';

export const TaskOptions = createTaskOptionsMap([
    {
        key: 'updatePods',
        // key: 'update-pods',
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
        key: 'provisioningStyle',
        // key: 'provisioning-style',
        isValueType: true,
        isRequired: true,
        description: 'Set provisioningStyle (Automatic | Manual)',
    },
    {
        key: 'codeSignIdentity',
        // key: 'code-sign-identity',
        isValueType: true,
        isRequired: true,
        description: 'Set codeSignIdentity (ie iPhone Distribution)',
    },
    {
        key: 'provisionProfileSpecifier',
        // key: 'provision-profile-specifier',
        isValueType: true,
        isRequired: true,
        description: 'Name of provisionProfile',
    },
    {
        key: 'xcodebuildArgs',
        // key: 'xcodebuild-args',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    {
        key: 'xcodebuildArchiveArgs',
        // key: 'xcodebuild-archive-args',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    {
        key: 'xcodebuildExportArgs',
        // key: 'xcodebuild-export-args',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
]);

export const TaskOptionPresets = createTaskOptionsPreset({
    withConfigure: [TaskOptions.provisioningStyle, TaskOptions.provisionProfileSpecifier, TaskOptions.codeSignIdentity],
});
