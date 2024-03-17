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

// const _requiresAssetOverride = async (c: RnvConfig) => {
//     const requiredAssets = c.runtime.engine?.platforms?.[c.platform]?.requiredAssets || [];

//     const assetsToCopy = [];
//     const assetsDir = path.join(c.paths.project.appConfigBase.dir, 'assets', c.platform);

//     requiredAssets.forEach((v) => {
//         const sourcePath = path.join(c.runtime.engine.originalTemplateAssetsDir, c.platform, v);

//         const destPath = path.join(assetsDir, v);

//         if (fsExistsSync(sourcePath)) {
//             if (!fsExistsSync(destPath)) {
//                 assetsToCopy.push({
//                     sourcePath,
//                     destPath,
//                     value: v,
//                 });
//             }
//         }
//     });

//     const actionOverride = 'Override exisitng folder';
//     const actionMerge = 'Merge with existing folder';
//     const actionSkip = 'Skip. Warning: this might fail your build';

//     if (assetsToCopy.length > 0) {
//         if (!fsExistsSync(assetsDir)) {
//             logInfo(
//                 `Required assets: ${chalk().bold(
//                     JSON.stringify(assetsToCopy.map((v) => v.value))
//                 )} will be copied to ${chalk().bold('appConfigs/assets')} folder`
//             );
//             return true;
//         }

//         const { chosenAction } = await inquirerPrompt({
//             message: 'What to do next?',
//             type: 'list',
//             name: 'chosenAction',
//             choices: [actionOverride, actionMerge, actionSkip],
//             warningMessage: `Your appConfig/base/assets/${c.platform} exists but engine ${
//                 c.runtime.engine.config.id
//             } requires some additional assets:
// ${chalk().red(requiredAssets.join(','))}`,
//         });

//         if (chosenAction === actionOverride) {
//             await removeDirs([assetsDir]);
//         }

//         if (chosenAction === actionOverride || chosenAction === actionMerge) {
//             return true;
//         }
//     }

//     return false;
// };

export const copyAssetsFolder = async (subPath?: string, customFn?: (c: RnvContext, platform: RnvPlatform) => void) => {
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

    const destPath = path.join(getPlatformProjectDir()!, subPath || '');

    // FOLDER MERGERS FROM EXTERNAL SOURCES
    if (validAssetSources.length > 0) {
        logInfo(
            `Found custom assetSources at ${chalk().gray(
                validAssetSources.join('/n')
            )}. Will be used to generate assets.`
        );
        validAssetSources.forEach((sourcePath) => {
            copyFolderContentsRecursiveSync(sourcePath, destPath, true, undefined, false, undefined, tsPathsConfig, c);
        });
        return;
    }

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        const hasAssetFolder = c.paths.appConfig.dirs.filter((v) =>
            fsExistsSync(path.join(v, `assets/${assetFolderPlatform}`))
        ).length;
        // const requireOverride = await _requiresAssetOverride(c);
        if (!hasAssetFolder) {
            logWarning(`Your app is missing assets at ${chalk().red(c.paths.appConfig.dirs.join(','))}.`);
            // await generateDefaultAssets(
            //     c,
            //     platform,
            //     path.join(c.paths.appConfig.dirs[0], `assets/${assetFolderPlatform}`)
            //     // requireOverride
            // );
        }
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, `assets/${assetFolderPlatform}`);
        if (!fsExistsSync(sourcePath)) {
            logWarning(`Your app is missing assets at ${chalk().red(sourcePath)}.`);
            // await generateDefaultAssets(c, platform, sourcePath);
        }
    }

    if (customFn) {
        return customFn(c, platform);
    }

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const sourcePath = path.join(v, `assets/${assetFolderPlatform}`);
            copyFolderContentsRecursiveSync(sourcePath, destPath, true, undefined, false, undefined, tsPathsConfig, c);
        });
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, `assets/${assetFolderPlatform}`);
        copyFolderContentsRecursiveSync(sourcePath, destPath, true, undefined, false, undefined, tsPathsConfig, c);
    }
};

export const cleanPlaformAssets = async () => {
    const c = getContext();
    logDefault('cleanPlaformAssets');

    await cleanFolder(c.paths.project.assets.dir);
    mkdirSync(c.paths.project.assets.runtimeDir);
    return true;
};
