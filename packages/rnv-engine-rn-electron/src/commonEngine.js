import { Constants, Common } from 'rnv';

import path from 'path';

const { getAppFolder, getTemplateDir } = Common;
const { MACOS, WINDOWS, RNV_PROJECT_DIR_NAME } = Constants;

export const getPlatformBuildDir = (c, isRelativePath) => getAppFolder(c, isRelativePath);

export const getPlatformOutputDir = (c) => {
    const dir = getPlatformBuildDir(c);
    return dir;
};

export const getTemplateProjectDir = (c) => {
    const dir = getTemplateDir(c);
    let output;
    switch (c.platform) {
        case MACOS:
        case WINDOWS:
            output = path.join(dir, RNV_PROJECT_DIR_NAME);
            break;
        default:
            output = dir;
    }
    return output;
};

export const getOriginalPlatformTemplatesDir = () => path.join(__dirname, '../platformTemplates');

export const getTemplateRootDir = (c, platform) => {
    const dir = c.paths.project.platformTemplatesDirs[platform];
    return dir;
};

export const ejectPlatform = () => {
    // Nothing to copy for next project
};

export const getPlatformProjectDir = (c) => {
    const dir = getPlatformBuildDir(c);
    let output;
    switch (c.platform) {
        case MACOS:
        case WINDOWS:
            output = path.join(dir, RNV_PROJECT_DIR_NAME);
            break;
        default:
            output = dir;
    }
    return output;
};
