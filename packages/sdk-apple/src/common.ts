import { RnvPlatform, getConfigProp } from '@rnv/core';
import { Context } from './types';

export const getAppFolderName = (c: Context, platform: RnvPlatform) => {
    // NOTE: DEPRECATED
    let projectFolder = getConfigProp(c, platform, 'projectFolder');
    if (projectFolder) {
        return projectFolder;
    }
    // NOTE: DEPRECATED
    projectFolder = getConfigProp(c, platform, 'scheme');
    if (projectFolder) {
        return projectFolder;
    }
    projectFolder = c.runtime.runtimeExtraProps?.xcodeProjectName;
    if (projectFolder) {
        return projectFolder;
    }
    return 'RNVApp';
};
