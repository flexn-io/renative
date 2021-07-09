import { Common, Constants } from 'rnv';

const { getConfigProp } = Common;
const { TVOS, MACOS } = Constants;

export const getAppFolderName = (c, platform) => {
    const projectFolder = getConfigProp(c, platform, 'projectFolder');
    if (projectFolder) {
        return projectFolder;
    }

    let appFolderName;
    switch (platform) {
        case MACOS:
            appFolderName = 'RNVAppMACOS';
            break;
        case TVOS:
            appFolderName = 'RNVAppTVOS';
            break;
        default:
            appFolderName = 'RNVApp';
            break;
    }
    return appFolderName;
};
