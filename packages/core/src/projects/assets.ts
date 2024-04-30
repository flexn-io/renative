import path from 'path';
import { getPlatformProjectDir, getTimestampPathsConfig } from '../context/contextProps';
import { isPlatformActive } from '../platforms';
import { cleanFolder, copyFolderContentsRecursiveSync, fsExistsSync, mkdirSync } from '../system/fs';
import { chalk, logDefault, logWarning, logDebug, logInfo } from '../logger';
import { RnvPlatform } from '../types';
import { getConfigProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { resolveRelativePackage } from './utils';
import { RnvContext } from '../context/types';

export const copyRuntimeAssets = async () => {
    logDefault('copyRuntimeAssets');
    const c = getContext();
    const destPath = path.join(c.paths.project.assets.dir, 'runtime');

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const sourcePath = path.join(v, 'assets/runtime');
            copyFolderContentsRecursiveSync(sourcePath, destPath);
        });
    } else if (c.paths.appConfig.dir) {
        const sourcePath = path.join(c.paths.appConfig.dir, 'assets/runtime');
        copyFolderContentsRecursiveSync(sourcePath, destPath);
    }

    if (!c.buildConfig?.common) {
        logDebug('BUILD_CONFIG', c.buildConfig);
        logWarning(
            `Your ${chalk().bold(
                c.paths.appConfig.config
            )} is misconfigured. (Maybe you have older version?). Missing ${chalk().bold(
                '{ common: {} }'
            )} object at root`
        );

        return true;
    }

    return true;
};

// Copies assets from available sources for a platform
// destPath - can be either absolute or relative to platformBuilds/*_platform dir,
// default is platformBuilds/*_platform dir absolute path
export const copyAssetsFolder = async (
    destPath?: string,
    customFn?: (c: RnvContext, platform: RnvPlatform) => void
) => {
    logDefault('copyAssetsFolder');

    const c = getContext();
    const { platform } = c;

    if (!isPlatformActive()) return;

    const assetFolderPlatform = getConfigProp('assetFolderPlatform') || platform;

    if (assetFolderPlatform !== platform) {
        logInfo(
            `Found custom assetFolderPlatform: ${chalk().green(
                assetFolderPlatform
            )}. Will use it instead of deafult ${platform}`
        );
    }

    const tsPathsConfig = getTimestampPathsConfig();

    const assetSources = getConfigProp('assetSources') || [];

    const validAssetSources: Array<string> = [];

    if (assetFolderPlatform) {
        assetSources.forEach((v) => {
            const assetsPath = path.join(resolveRelativePackage(c, v), assetFolderPlatform);

            if (fsExistsSync(assetsPath)) {
                validAssetSources.push(assetsPath);
            } else {
                logWarning(
                    `AssetSources is specified as ${chalk().red(v)}. But path ${chalk().red(assetsPath)} was not found.`
                );
            }
        });
    }

    const destinationPath =
        !!destPath && path.isAbsolute(destPath) ? destPath : path.join(getPlatformProjectDir()!, destPath || '');
    const hasExternalAssets = validAssetSources.length > 0;

    // FOLDER MERGERS FROM EXTERNAL SOURCES
    if (hasExternalAssets) {
        logInfo(
            `Found custom assetSources at ${chalk().gray(
                validAssetSources.join('/n')
            )}. Will be used to generate assets.`
        );
        validAssetSources.forEach((sourcePath) => {
            copyFolderContentsRecursiveSync(
                sourcePath,
                destinationPath,
                true,
                undefined,
                false,
                undefined,
                tsPathsConfig,
                c
            );
        });
    }

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        const hasAssetFolder = c.paths.appConfig.dirs.filter((v) =>
            fsExistsSync(path.join(v, `assets/${assetFolderPlatform}`))
        ).length;
        if (!hasAssetFolder && !hasExternalAssets) {
            logWarning(`Your app is missing assets at ${chalk().red(c.paths.appConfig.dirs.join(','))}.`);
        }
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, `assets/${assetFolderPlatform}`);
        if (!fsExistsSync(sourcePath) && !hasExternalAssets) {
            logWarning(`Your app is missing assets at ${chalk().red(sourcePath)}.`);
        }
    }

    if (customFn) {
        return customFn(c, platform);
    }

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const sourcePath = path.join(v, `assets/${assetFolderPlatform}`);
            copyFolderContentsRecursiveSync(
                sourcePath,
                destinationPath,
                true,
                undefined,
                false,
                undefined,
                tsPathsConfig,
                c
            );
        });
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, `assets/${assetFolderPlatform}`);
        copyFolderContentsRecursiveSync(
            sourcePath,
            destinationPath,
            true,
            undefined,
            false,
            undefined,
            tsPathsConfig,
            c
        );
    }
};

export const cleanPlaformAssets = async () => {
    const c = getContext();
    logDefault('cleanPlaformAssets');

    await cleanFolder(c.paths.project.assets.dir);
    mkdirSync(c.paths.project.assets.runtimeDir);
    return true;
};
