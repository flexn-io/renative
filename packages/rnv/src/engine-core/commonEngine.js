import { getAppFolder, getTemplateDir } from '../core/common';
import { logError } from '../core/systemManager/logger';

export const getPlatformBuildDir = c => getAppFolder(c);

export const getPlatformOutputDir = () => {
    logError('core engine does not support getPlatformOutputDir');
    return null;
};

export const getTemplateRootDir = () => {
    logError('core engine does not support getTemplateRootDir');
    return null;
};

export const ejectPlatform = () => {
    logError('core engine does not support ejectPlatform');
    // Do nothing
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
