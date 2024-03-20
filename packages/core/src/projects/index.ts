import path from 'path';
import {
    getAppConfigBuildsFolder,
    getAppFolder,
    getPlatformProjectDir,
    getTimestampPathsConfig,
} from '../context/contextProps';
import { isPlatformActive } from '../platforms';
import { copyTemplatePluginsSync, parsePlugins } from '../plugins';
import {
    cleanFolder,
    copyFolderContentsRecursiveSync,
    copyFileSync,
    mkdirSync,
    readObjectSync,
    writeFileSync,
    fsWriteFileSync,
    fsExistsSync,
    fsReaddirSync,
    fsReadFileSync,
    resolvePackage,
} from '../system/fs';
import { installPackageDependencies, isYarnInstalled } from './npm';
import { executeAsync } from '../system/exec';
import { chalk, logDefault, logWarning, logDebug, logInfo, getCurrentCommand } from '../logger';
import { configureTemplateFiles, configureEntryPoint } from '../templates';
import { parseRenativeConfigs } from '../configs';
import { RnvContext } from '../context/types';
import { RnvPlatform } from '../types';
import { ParseFontsCallback } from './types';
import { inquirerPrompt } from '../api';
import { upgradeProjectDependencies } from '../configs/configProject';
import { generateConfigPropInjects } from '../system/injectors';
import { ConfigFileApp, ConfigFileEngine, ConfigFileProject, ConfigFileTemplate } from '../schema/configFiles/types';
import { getConfigProp } from '../context/contextProps';
import { ConfigName } from '../enums/configName';
import { getContext } from '../context/provider';

export const checkAndBootstrapIfRequired = async () => {
    logDefault('checkAndBootstrapIfRequired');
    const c = getContext();

    const template: string = c.program?.template;
    if (!c.paths.project.configExists && template) {
        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add ${template}`, {
            cwd: c.paths.project.dir,
        });

        const templateArr = template.split('@').filter((v) => v !== '');
        const templateDir = template.startsWith('@') ? `@${templateArr[0]}` : templateArr[0];
        const templatePath = path.join(c.paths.project.dir, 'node_modules', templateDir);

        c.paths.template.dir = templatePath;
        c.paths.template.configTemplate = path.join(templatePath, ConfigName.renativeTemplate);

        const templateObj = readObjectSync<ConfigFileTemplate>(c.paths.template.configTemplate);
        const appConfigPath = path.join(c.paths.project.appConfigsDir, c.program.appConfigID, 'renative.json');
        //TODO: Investigate whether we really need to support this: supportedPlatforms inside appconfig
        const appConfigObj = readObjectSync<ConfigFileApp & ConfigFileProject>(appConfigPath);
        const supportedPlatforms = appConfigObj?.defaults?.supportedPlatforms || [];
        //=========
        const engineTemplates = c.files.rnv.projectTemplates?.config?.engineTemplates;
        const rnvPlatforms = c.files.rnv.projectTemplates?.config?.platformTemplates || {};
        const activeEngineKeys: Array<string> = [];

        if (engineTemplates) {
            supportedPlatforms.forEach((supPlat) => {
                Object.keys(engineTemplates).forEach((eKey) => {
                    if (engineTemplates[eKey].id === rnvPlatforms[supPlat]?.engine) {
                        activeEngineKeys.push(eKey);
                    }
                });
            });
        }

        if (!templateObj) {
            return;
        }

        const config = {
            ...templateObj,
        };

        // Clean unused engines
        if (config.engines) {
            Object.keys(config.engines).forEach((k) => {
                if (!activeEngineKeys.includes(k)) {
                    delete config.engines?.[k];
                }
            });
        }

        if (config.templateConfig?.package_json) {
            const pkgJson = config.templateConfig.package_json;
            if (!pkgJson.devDependencies) pkgJson.devDependencies = {};
            if (!pkgJson.dependencies) pkgJson.dependencies = {};
            c.files.project.package = pkgJson;

            const installPromises: Array<Promise<string>> = [];
            Object.keys(pkgJson.devDependencies).forEach((devDepKey) => {
                if (activeEngineKeys.includes(devDepKey)) {
                    installPromises.push(
                        executeAsync(`npx yarn add ${devDepKey}@${pkgJson.devDependencies?.[devDepKey]}`, {
                            cwd: c.paths.project.dir,
                        })
                    );
                }
            });

            if (installPromises.length) {
                await Promise.all(installPromises);

                logInfo('Installed engines DONE');

                activeEngineKeys.forEach((aek) => {
                    const engineConfigPath = path.join(
                        c.paths.project.dir,
                        'node_modules',
                        aek,
                        'renative.engine.json'
                    );
                    const eConfig = readObjectSync<ConfigFileEngine>(engineConfigPath);
                    if (eConfig?.platforms) {
                        supportedPlatforms.forEach((supPlat) => {
                            const engPlatNpm = eConfig.platforms?.[supPlat]?.npm;
                            if (engPlatNpm) {
                                const engPlatDeps = engPlatNpm.dependencies;
                                const deps = pkgJson.dependencies || {};
                                pkgJson.dependencies = deps;
                                if (engPlatDeps) {
                                    Object.keys(engPlatDeps).forEach((engPlatDepKey) => {
                                        if (!deps[engPlatDepKey]) {
                                            logInfo(`Installing active engine dependency ${engPlatDepKey}`);
                                            deps[engPlatDepKey] = engPlatDeps[engPlatDepKey];
                                        }
                                    });
                                }

                                const engPlatDevDeps = engPlatNpm.devDependencies;
                                if (engPlatDevDeps) {
                                    Object.keys(engPlatDevDeps).forEach((engPlatDevDepKey) => {
                                        pkgJson.devDependencies = pkgJson.devDependencies || {};
                                        if (!pkgJson.devDependencies[engPlatDevDepKey]) {
                                            logInfo(`Installing active engine dependency ${engPlatDevDepKey}`);
                                            pkgJson.devDependencies[engPlatDevDepKey] =
                                                engPlatDevDeps[engPlatDevDepKey];
                                        }
                                    });
                                }

                                const engPlatOptDeps = engPlatNpm.optionalDependencies;
                                if (engPlatOptDeps) {
                                    Object.keys(engPlatOptDeps).forEach((engPlatOptDepKey) => {
                                        pkgJson.optionalDependencies = pkgJson.optionalDependencies || {};
                                        if (!pkgJson.optionalDependencies[engPlatOptDepKey]) {
                                            logInfo(`Installing active engine dependency ${engPlatOptDepKey}`);
                                            pkgJson.optionalDependencies[engPlatOptDepKey] =
                                                engPlatOptDeps[engPlatOptDepKey];
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }

            writeFileSync(c.paths.project.package, pkgJson);
        }

        delete config.templateConfig;
        writeFileSync(c.paths.project.config, config);

        const appConfigsPath = path.join(templatePath, 'appConfigs');
        if (fsExistsSync(appConfigsPath)) {
            copyFolderContentsRecursiveSync(appConfigsPath, path.join(c.paths.project.appConfigsDir));
        }

        await installPackageDependencies();

        if (c.program.npxMode) {
            return;
        }

        await parseRenativeConfigs();

        await configureTemplateFiles();
        await configureEntryPoint(c.platform);
        // await applyTemplate(c);

        // copyFolderContentsRecursiveSync(templatePath, c.paths.project.dir);
    }
    return true;
};

export const checkAndCreateGitignore = async () => {
    const c = getContext();

    logDefault('checkAndCreateGitignore');
    const ignrPath = path.join(c.paths.project.dir, '.gitignore');
    if (!fsExistsSync(ignrPath)) {
        logInfo('Your .gitignore is missing. CREATING...DONE');

        copyFileSync(path.join(c.paths.rnv.dir, 'coreTemplateFiles/.gitignore.tpl'), ignrPath);
    }
    return true;
};

export const configureFonts = async () => {
    const c = getContext();

    // FONTS
    let fontsObj = 'export default [';

    const duplicateFontCheck: Array<string> = [];
    parseFonts((font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf') || font.includes('.woff')) {
            const keOriginal = font.split('.')[0];
            const keyNormalised = keOriginal.replace(/__/g, ' ');
            const includedFonts = getConfigProp('includedFonts');
            if (includedFonts) {
                if (
                    includedFonts.includes('*') ||
                    includedFonts.includes(keOriginal) ||
                    includedFonts.includes(keyNormalised)
                ) {
                    if (font && !duplicateFontCheck.includes(font)) {
                        duplicateFontCheck.push(font);
                        const fontSource = path.join(dir, font).replace(/\\/g, '\\\\');
                        if (fsExistsSync(fontSource)) {
                            // const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                            // mkdirSync(fontFolder);
                            // const fontDest = path.join(fontFolder, font);
                            // copyFileSync(fontSource, fontDest);
                            fontsObj += `{
                              fontFamily: '${keyNormalised}',
                              file: require('${fontSource}'),
                          },`;
                        } else {
                            logWarning(`Font ${chalk().bold(fontSource)} doesn't exist! Skipping.`);
                        }
                    }
                }
            }
        }
    });

    fontsObj += '];';
    if (!fsExistsSync(c.paths.project.assets.runtimeDir)) {
        mkdirSync(c.paths.project.assets.runtimeDir);
    }
    const fontJsPath = path.join(c.paths.project.assets.dir, 'runtime', 'fonts.web.js');
    if (fsExistsSync(fontJsPath)) {
        const existingFileContents = fsReadFileSync(fontJsPath).toString();

        if (existingFileContents !== fontsObj) {
            logDebug('newFontsJsFile');
            fsWriteFileSync(fontJsPath, fontsObj);
        }
    } else {
        logDebug('newFontsJsFile');
        fsWriteFileSync(fontJsPath, fontsObj);
    }

    const coreTemplateFiles = path.resolve(c.paths.rnv.dir, 'coreTemplateFiles');
    copyFileSync(
        path.resolve(coreTemplateFiles, 'fontManager.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.js')
    );
    copyFileSync(
        path.resolve(coreTemplateFiles, 'fontManager.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.server.web.js')
    );
    copyFileSync(
        path.resolve(coreTemplateFiles, 'fontManager.web.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.web.js')
    );

    return true;
};

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

export const parseFonts = (callback: ParseFontsCallback) => {
    logDefault('parseFonts');

    const c = getContext();

    if (c.buildConfig) {
        // FONTS - PROJECT CONFIG
        if (fsExistsSync(c.paths.project.appConfigBase.fontsDir)) {
            fsReaddirSync(c.paths.project.appConfigBase.fontsDir).forEach((font) => {
                if (callback) {
                    callback(font, c.paths.project.appConfigBase.fontsDir);
                }
            });
        }
        // FONTS - APP CONFIG
        if (c.paths.appConfig.fontsDirs) {
            c.paths.appConfig.fontsDirs.forEach((v) => {
                if (fsExistsSync(v)) {
                    fsReaddirSync(v).forEach((font) => {
                        if (callback) callback(font, v);
                    });
                }
            });
        } else if (fsExistsSync(c.paths.appConfig.fontsDir)) {
            fsReaddirSync(c.paths.appConfig.fontsDir).forEach((font) => {
                if (callback) callback(font, c.paths.appConfig.fontsDir);
            });
        }
        _parseFontSources(c, getConfigProp('fontSources') || [], callback);
        // PLUGIN FONTS
        parsePlugins((plugin) => {
            if (plugin.config?.fontSources) {
                _parseFontSources(c, plugin.config?.fontSources, callback);
            }
        }, true);
    }
};

const _parseFontSources = (c: RnvContext, fontSourcesArr: Array<string>, callback: ParseFontsCallback) => {
    const fontSources = fontSourcesArr.map((v) => _resolvePackage(c, v));
    fontSources.forEach((fontSourceDir) => {
        if (fsExistsSync(fontSourceDir)) {
            fsReaddirSync(fontSourceDir).forEach((font) => {
                if (callback) callback(font, fontSourceDir);
            });
        }
    });
};

const _resolvePackage = (c: RnvContext, v: string) => {
    if (v?.startsWith?.('./')) {
        return path.join(c.paths.project.dir, v);
    }
    return resolvePackage(v);
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
            const assetsPath = path.join(_resolvePackage(c, v), assetFolderPlatform);

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

//NOTE: Default assets have been removed from engines
// const generateDefaultAssets = async (c: RnvConfig, platform, sourcePath, forceTrue) => {
//     logDefault('generateDefaultAssets');
// let confirmAssets = true;
// if (c.program.ci !== true && c.program.yes !== true && !forceTrue) {
//     const { confirm } = await inquirerPrompt({
//         type: 'confirm',
//         message: `It seems you don't have assets configured in ${chalk().bold(
//             sourcePath
//         )} do you want generate default ones?`,
//     });
//     confirmAssets = confirm;
// }

// if (confirmAssets) {
//     const engine = getEngineRunnerByPlatform(c, c.platform);
//     if (fsExistsSync(path.join(engine.originalTemplateAssetsDir, platform))) {
//         copyFolderContentsRecursiveSync(path.join(engine.originalTemplateAssetsDir, platform), sourcePath);
//     } else {
//         logWarning('Currently used engine does not have default assets, creating an empty folder');
//         mkdirSync(sourcePath);
//     }
// }
// };

export const copyBuildsFolder = () =>
    new Promise<void>((resolve) => {
        logDefault('copyBuildsFolder');
        const c = getContext();

        if (!isPlatformActive(resolve)) return;

        const destPath = path.join(getAppFolder());
        const tsPathsConfig = getTimestampPathsConfig();

        generateConfigPropInjects();
        const allInjects = [...c.configPropsInjects, ...c.systemPropsInjects, ...c.runtimePropsInjects];

        // FOLDER MERGERS PROJECT CONFIG
        const sourcePath1 = getAppConfigBuildsFolder(c.paths.project.appConfigBase.dir);
        copyFolderContentsRecursiveSync(sourcePath1, destPath, true, undefined, false, allInjects, tsPathsConfig);

        // FOLDER MERGERS PROJECT CONFIG (PRIVATE)
        const sourcePath1sec = getAppConfigBuildsFolder(c.paths.workspace.project.appConfigBase.dir);
        copyFolderContentsRecursiveSync(sourcePath1sec, destPath, true, undefined, false, allInjects, tsPathsConfig);

        // DEPRECATED SHARED
        if (c.runtime.currentPlatform?.isWebHosted) {
            const sourcePathShared = path.join(c.paths.project.appConfigBase.dir, 'builds/_shared');
            if (fsExistsSync(sourcePathShared)) {
                logWarning('Folder builds/_shared is DEPRECATED. use builds/<PLATFORM> instead ');
            }
            copyFolderContentsRecursiveSync(sourcePathShared, getAppFolder(), true, undefined, false, allInjects);
        }

        // FOLDER MERGERS FROM APP CONFIG + EXTEND
        if (c.paths.appConfig.dirs) {
            c.paths.appConfig.dirs.forEach((v) => {
                const sourceV = getAppConfigBuildsFolder(v);
                copyFolderContentsRecursiveSync(sourceV, destPath, true, undefined, false, allInjects, tsPathsConfig);
            });
        } else {
            copyFolderContentsRecursiveSync(
                getAppConfigBuildsFolder(c.paths.appConfig.dir),
                destPath,
                true,
                undefined,
                false,
                allInjects,
                tsPathsConfig
            );
        }

        // FOLDER MERGERS FROM APP CONFIG (PRIVATE)
        const sourcePath0sec = getAppConfigBuildsFolder(c.paths.workspace.appConfig.dir);
        copyFolderContentsRecursiveSync(sourcePath0sec, destPath, true, undefined, false, allInjects, tsPathsConfig);

        copyTemplatePluginsSync(c);

        resolve();
    });

export const versionCheck = async (c: RnvContext) => {
    logDefault('versionCheck');

    if (c.runtime.versionCheckCompleted || c.files.project?.config?.skipAutoUpdate || c.program.skipDependencyCheck) {
        return true;
    }
    c.runtime.rnvVersionRunner = c.files.rnv?.package?.version || 'unknown';
    c.runtime.rnvVersionProject =
        c.files.project?.package?.devDependencies?.rnv || c.files.project?.package?.dependencies?.rnv || 'unknown';
    logDefault(
        `versionCheck:rnvRunner:${c.runtime.rnvVersionRunner},rnvProject:${c.runtime.rnvVersionProject}`,
        chalk().grey
    );
    if (c.runtime.rnvVersionRunner && c.runtime.rnvVersionProject) {
        if (c.runtime.rnvVersionRunner !== c.runtime.rnvVersionProject && !c.program.skipRnvCheck) {
            const recCmd = chalk().bold(`$ npx ${getCurrentCommand(true)}`);
            const actionNoUpdate = 'Continue and skip updating package.json';
            const actionWithUpdate = 'Continue and update package.json';
            const actionUpgrade = `Upgrade project to ${c.runtime.rnvVersionRunner}`;

            const { chosenAction } = await inquirerPrompt({
                message: 'What to do next?',
                type: 'list',
                name: 'chosenAction',
                choices: [actionNoUpdate, actionWithUpdate, actionUpgrade],
                warningMessage: `You are running $rnv v${chalk().red(
                    c.runtime.rnvVersionRunner
                )} against project built with rnv v${chalk().red(
                    c.runtime.rnvVersionProject
                )}. This might result in unexpected behaviour!
It is recommended that you run your rnv command with npx prefix: ${recCmd} . or manually update your devDependencies.rnv version in your package.json.`,
            });

            c.runtime.versionCheckCompleted = true;

            c.runtime.skipPackageUpdate = chosenAction === actionNoUpdate;

            if (chosenAction === actionUpgrade) {
                upgradeProjectDependencies(c.runtime.rnvVersionRunner);
            }
        }
    }
    return true;
};

export const cleanPlaformAssets = async () => {
    const c = getContext();
    logDefault('cleanPlaformAssets');

    await cleanFolder(c.paths.project.assets.dir);
    mkdirSync(c.paths.project.assets.runtimeDir);
    return true;
};
