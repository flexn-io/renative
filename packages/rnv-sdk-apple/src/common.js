import { Common } from 'rnv';

const { getConfigProp } = Common;

export const getAppFolderName = (c, platform) => {
    const projectFolder = getConfigProp(c, platform, 'projectFolder');
    if (projectFolder) {
        return projectFolder;
    }
    const schemeFolder = getConfigProp(c, platform, 'scheme');
    if (schemeFolder) {
        return schemeFolder;
    }
    return 'RNVApp';
};
