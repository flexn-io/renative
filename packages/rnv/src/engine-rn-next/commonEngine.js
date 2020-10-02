import { getAppFolder, getTemplateDir } from '../core/common';
// import { logError } from '../core/systemManager/logger';
// import { MACOS, WINDOWS, RNV_PROJECT_DIR_NAME } from '../core/constants';

export const getPlatformBuildDir = c => getAppFolder(c);

export const getPlatformOutputDir = (c) => {
    const dir = getPlatformBuildDir(c);
    let output;
    switch (c.platform) {
        default:
            output = dir;
    }
    return output;
};

export const getTemplateProjectDir = (c) => {
    const dir = getTemplateDir(c);
    let output;
    switch (c.platform) {
        default:
            output = dir;
    }
    return output;
};

export const getPlatformProjectDir = (c) => {
    const dir = getPlatformBuildDir(c);
    let output;
    switch (c.platform) {
        default:
            output = dir;
    }
    return output;
};
