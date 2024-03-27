import { PlatformKey, getConfigProp, getContext } from '@rnv/core';

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

export const SdkPlatforms: Array<PlatformKey> = ['ios', 'tvos', 'macos'];
