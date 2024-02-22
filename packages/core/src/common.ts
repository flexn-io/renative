import path from 'path';
import { fsExistsSync } from './system/fs';
import { chalk, logError, logWarning } from './logger';
import type { RnvContext } from './context/types';
import type { TimestampPathsConfig } from './system/types';
import type { RnvPlatform } from './types';
import { getConfigProp } from './configs/configProp';

export const getTimestampPathsConfig = (c: RnvContext, platform: RnvPlatform): TimestampPathsConfig | undefined => {
    let timestampBuildFiles: Array<string> = [];
    const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);
    if (platform === 'web') {
        timestampBuildFiles = (getConfigProp(c, platform, 'timestampBuildFiles') || []).map((v) => path.join(pPath, v));
    }
    if (timestampBuildFiles?.length && c.runtime.timestamp) {
        return { paths: timestampBuildFiles, timestamp: c.runtime.timestamp };
    }
    return undefined;
};

//TODO: rename to getPlatformBuildAppDir ???
export const getAppFolder = (c: RnvContext, isRelativePath?: boolean) => {
    if (isRelativePath) {
        return `platformBuilds/${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`;
    }
    return path.join(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`
    );
};

export const getPlatformProjectDir = (c: RnvContext) => {
    if (!c.runtime.engine) {
        logError('getPlatformProjectDir not available without specific engine');
        return null;
    }
    return path.join(getAppFolder(c), c.runtime.engine.projectDirName || '');
};

export const getAppConfigBuildsFolder = (c: RnvContext, platform: RnvPlatform, customPath?: string) => {
    const pp = customPath || c.paths.appConfig.dir;
    if (!pp) {
        logWarning(
            `getAppConfigBuildsFolder: Path ${chalk().white(
                'c.paths.appConfig.dir'
            )} not defined! can't return path. You might not be in renative project`
        );
        return null;
    }
    const p = path.join(pp, `builds/${platform}@${c.runtime.scheme}`);
    if (fsExistsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};
