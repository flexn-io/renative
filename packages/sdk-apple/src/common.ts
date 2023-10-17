import { RnvPlatform, getConfigProp } from '@rnv/core';
import { Context } from './types';

export const getAppFolderName = (c: Context, platform: RnvPlatform) => {
    // NOTE: DEPRECATED
    let projectFolder = getConfigProp(c, platform, 'scheme');
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
