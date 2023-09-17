import { getConfigProp } from '@rnv/core';
import { Context } from './types';

export const getAppFolderName = (c: Context, platform: string) => {
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
