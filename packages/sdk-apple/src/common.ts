import { Common, RnvContext } from 'rnv';
import { Payload } from './types';

const { getConfigProp } = Common;

export const getAppFolderName = (c: RnvContext<Payload>, platform: string) => {
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
