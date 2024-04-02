import { RnvPlatformKey, RnvTaskOption, RnvTaskOptionPresets, getConfigProp, getContext } from '@rnv/core';

export const getAppFolderName = () => {
    const c = getContext();

    // NOTE: DEPRECATED
    let projectFolder = getConfigProp('scheme');
    if (projectFolder) {
        return projectFolder;
    }
    //TODO: make this dynamic prop based on XXX.xcodeproj search
    projectFolder = c.runtime.runtimeExtraProps?.xcodeProjectName;
    if (projectFolder) {
        return projectFolder;
    }
    return 'RNVApp';
};

export const SdkPlatforms: Array<RnvPlatformKey> = ['ios', 'tvos', 'macos'];

export const _TaskOptions = {
    updatePods: {
        key: 'updatePods',
        // key: 'update-pods',
        shortcut: 'u',
        description: 'Force update dependencies (iOS only)',
    },
    keychain: {
        key: 'keychain',
        isValueType: true,
        isRequired: true,
        description: 'Name of the keychain',
    },
    provisioningStyle: {
        key: 'provisioningStyle',
        // key: 'provisioning-style',
        isValueType: true,
        isRequired: true,
        description: 'Set provisioningStyle (Automatic | Manual)',
    },
    codeSignIdentity: {
        key: 'codeSignIdentity',
        // key: 'code-sign-identity',
        isValueType: true,
        isRequired: true,
        description: 'Set codeSignIdentity (ie iPhone Distribution)',
    },
    provisionProfileSpecifier: {
        key: 'provisionProfileSpecifier',
        // key: 'provision-profile-specifier',
        isValueType: true,
        isRequired: true,
        description: 'Name of provisionProfile',
    },
    xcodebuildArgs: {
        key: 'xcodebuildArgs',
        // key: 'xcodebuild-args',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    xcodebuildArchiveArgs: {
        key: 'xcodebuildArchiveArgs',
        // key: 'xcodebuild-archive-args',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
    xcodebuildExportArgs: {
        key: 'xcodebuildExportArgs',
        // key: 'xcodebuild-export-args',
        isValueType: true,
        isRequired: true,
        description: 'pass down custom xcodebuild arguments',
    },
};

export type ProgramOptionsKey = keyof typeof _TaskOptions;

export const SDKTaskOptions = _TaskOptions as Record<ProgramOptionsKey, RnvTaskOption>;

export const SDKTaskOptionPresets = {
    withConfigure: (arr?: Array<RnvTaskOption>) =>
        RnvTaskOptionPresets.withConfigure(
            [
                SDKTaskOptions.provisioningStyle,
                SDKTaskOptions.provisionProfileSpecifier,
                SDKTaskOptions.codeSignIdentity,
            ].concat(arr || [])
        ),
};
