import { Common } from 'rnv';

const { getConfigProp } = Common;

export const getAppFolderName = (c, platform) => {
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
    projectFolder = c.runtime.runtimeExtraProps?.xcodeProjectNameFolder;
    if (projectFolder) {
        return projectFolder;
    }
    return 'RNVApp';
};
