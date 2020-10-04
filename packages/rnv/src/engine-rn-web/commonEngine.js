import path from 'path';
import { getAppFolder, getTemplateDir } from '../core/common';
import { logError } from '../core/systemManager/logger';
import {
    TIZEN,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    WEBOS,
    KAIOS,
    WEB,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST,
    RNV_PROJECT_DIR_NAME
} from '../core/constants';
import { copyFolderContentsRecursiveSync } from '../core/systemManager/fileutils';

export const getPlatformBuildDir = c => getAppFolder(c);

export const getPlatformOutputDir = () => {
    logError('core engine does not support getPlatformOutputDir');
    return null;
};

export const getTemplateProjectDir = (c) => {
    const dir = getTemplateDir(c);
    let output;
    switch (c.platform) {
        case TIZEN:
        case TIZEN_WATCH:
        case TIZEN_MOBILE:
        case WEBOS:
        case KAIOS:
        case WEB:
        case FIREFOX_OS:
        case FIREFOX_TV:
        case CHROMECAST:
            output = path.join(dir, RNV_PROJECT_DIR_NAME);
            break;
        default:
            output = dir;
    }
    return output;
};

export const getTemplateRootDir = (c, platform) => {
    const dir = c.paths.project.platformTemplatesDirs[platform];
    return dir;
};

export const ejectPlatform = (c, platform, destFolder) => {
    const sourcePlatformDir = getTemplateRootDir(c, platform);
    copyFolderContentsRecursiveSync(
        path.join(sourcePlatformDir, platform),
        destFolder
    );
    copyFolderContentsRecursiveSync(
        path.join(sourcePlatformDir, '_shared'),
        destFolder
    );
};

export const getPlatformProjectDir = (c) => {
    const dir = getPlatformBuildDir(c);
    let output;
    switch (c.platform) {
        case TIZEN:
        case TIZEN_WATCH:
        case TIZEN_MOBILE:
        case WEBOS:
        case KAIOS:
        case WEB:
        case FIREFOX_OS:
        case FIREFOX_TV:
        case CHROMECAST:
            output = path.join(dir, RNV_PROJECT_DIR_NAME);
            break;
        default:
            output = dir;
    }
    return output;
};
