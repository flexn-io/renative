import path from 'path';
import {
    copyFolderContentsRecursiveSync,
    copyFileSync,
    removeDirsSync,
    removeFilesSync,
    mergeObjects,
    readObjectSync,
    fsExistsSync,
    fsLstatSync,
    // fsUnlinkSync,
    // removeDirSync,
} from '../system/fs';
import { chalk, logError, logInfo, logWarning, logDefault, logDebug } from '../logger';
// import { loadFileExtended } from '../configs';
import { doResolve } from '../system/resolve';
import { RnvContext } from '../context/types';
import { generateOptions, inquirerPrompt } from '../api';
import { PromptOptions } from '../api/types';
import { RnvPlatform } from '../types';
// import { listAppConfigsFoldersSync } from '../configs/appConfigs';
import { writeRenativeConfigFile } from '../configs/utils';
import { checkIfProjectAndNodeModulesExists } from '../projects/dependencies';
import { ConfigFileProject, ConfigFileTemplate } from '../schema/configFiles/types';
// import { PlatformKey } from '../schema/types';
import { getConfigProp } from '../context/contextProps';
import { RnvFileName } from '../enums/fileName';
import { getContext } from '../context/provider';
import { RnvFolderName } from '../enums/folderName';

const _cleanProjectTemplateSync = (c: RnvContext) => {
    logDefault('_cleanProjectTemplateSync');
    const dirsToRemove = [c.paths.project.appConfigBase.dir, c.paths.project.srcDir!, c.paths.project.appConfigsDir];

    const filesToRemove = c.buildConfig.defaults?.supportedPlatforms?.map((p) =>
        path.join(c.paths.project.dir, `index.${p}.js`)
    );

    removeDirsSync(dirsToRemove);
    // TODO: NOT SERVED FROM TEMPLATE YET
    if (filesToRemove) removeFilesSync(filesToRemove);
};

const _applyTemplate = async (c: RnvContext) => {
    logDefault('_applyTemplate', `current:${c.buildConfig.currentTemplate} selected:${c.runtime.selectedTemplate}`);

    if (c.runtime.selectedTemplate) {
        _cleanProjectTemplateSync(c);

        c.paths.template.dir = doResolve(c.runtime.selectedTemplate) || 'Error: unresolved';
    } else {
        c.paths.template.dir = doResolve(c.buildConfig.currentTemplate) || 'Error: unresolved';
    }

    if (c.paths.template.dir) {
        c.paths.template.configTemplate = path.join(c.paths.template.dir, RnvFileName.renativeTemplate);

        c.paths.template.config = path.join(c.paths.template.dir, RnvFileName.renative);
    }

    if (!fsExistsSync(c.paths.template.configTemplate)) {
        logWarning(
            `Template file ${chalk().bold(c.paths.template.configTemplate)} does not exist. check your ${chalk().bold(
                c.paths.template.dir
            )}. skipping`
        );
        return true;
    }

    logDebug(`_applyTemplate:${c.runtime.selectedTemplate}:${c.paths.template.dir}`);

    if (c.paths.template.dir) c.paths.template.appConfigsDir = path.join(c.paths.template.dir, 'appConfigs');
    c.paths.template.appConfigBase.dir = path.join(c.paths.template.appConfigsDir, 'base');
    c.runtime.currentTemplate = c.files.project.config?.currentTemplate || c.runtime.currentTemplate;
    if (!c.runtime.currentTemplate) {
        if (c.files.project.config?.templates) {
            c.runtime.currentTemplate = Object.keys(c.files.project.config.templates)[0];
        }

        c.runtime.requiresForcedTemplateApply = true;
    }

    if (c.buildConfig.currentTemplate) {
        c.runtime.activeTemplate = `${c.buildConfig.currentTemplate}@${
            c.buildConfig.templates?.[c.buildConfig.currentTemplate]?.version
        }`;
    }

    return true;
};

// DEPRECATED - left here only for temporary reference
// const _configureAppConfigs = async (c: RnvContext) => {
//     // Check appConfigs
//     logDebug('configureProject:check appConfigs');
//     //
//     if (!fsExistsSync(c.paths.project.appConfigsDir)) {
//         logInfo(
//             `Your appConfig folder ${chalk().bold(
//                 c.paths.project.appConfigsDir
//             )} is missing! ReNative will create one from template.`
//         );

//         // TODO: GET CORRECT PROJECT TEMPLATE
//         copyFolderContentsRecursiveSync(c.paths.template.appConfigsDir, c.paths.project.appConfigsDir);

//         const appConfigIds = listAppConfigsFoldersSync(false);

//         // Update App Title to match package.json
//         try {
//             const supPlats = c.files.project?.config?.defaults?.supportedPlatforms;
//             appConfigIds.forEach((v) => {
//                 const appConfigPath = path.join(c.paths.project.appConfigsDir, v, RnvFileName.renative);
//                 const appConfig = readObjectSync<ConfigFileApp>(appConfigPath);
//                 if (appConfig) {
//                     if (appConfig.skipBootstrapCopy) {
//                         fsUnlinkSync(appConfigPath);
//                         if (v !== 'base') {
//                             removeDirSync(path.join(c.paths.project.appConfigsDir, v));
//                         }
//                     } else if (!appConfig.hidden) {
//                         appConfig.common = appConfig.common || {};
//                         //TODO: this needs to use bootstrap_metadata to work properly
//                         // appConfig.common.title = c.files.project.config?.defaults?.title;
//                         // appConfig.common.id = c.files.project.config?.defaults?.id;

//                         if (supPlats && appConfig.platforms) {
//                             (Object.keys(appConfig.platforms) as PlatformKey[]).forEach((pk) => {
//                                 if (!supPlats.includes(pk)) {
//                                     delete appConfig.platforms?.[pk];
//                                 }
//                             });
//                         }

//                         writeRenativeConfigFile(appConfigPath, appConfig);
//                     }
//                 }
//             });
//         } catch (e) {
//             logError(e);
//         }
//     }
// };

// const _configureProjectConfig = (c: RnvContext) =>
//     new Promise<void>((resolve) => {
//         // Check projectConfigs
//         logDebug('configureProject:check projectConfigs');
//         if (!fsExistsSync(c.paths.project.appConfigBase.dir)) {
//             logInfo(
//                 `Your projectConfig folder ${chalk().bold(
//                     c.paths.project.appConfigBase.dir
//                 )} is missing! CREATING...DONE`
//             );
//             copyFolderContentsRecursiveSync(c.paths.template.appConfigBase.dir, c.paths.project.appConfigBase.dir);
//         }
//         resolve();
//     });

// const _configureRenativeConfig = async (c: RnvContext) => {
//     // renative.json
//     const templateConfig = readObjectSync<ConfigFileTemplate>(c.paths.template.configTemplate);
//     logDebug('configureProject:check renative.json');

//     if (c.runtime.selectedTemplate || c.runtime.requiresForcedTemplateApply || c.files.project.config?.isNew) {
//         logInfo(
//             `Your ${c.paths.project.config} needs to be updated with ${c.paths.template.configTemplate}. UPDATING...DONE`
//         );
//         const mergedObjBase = getProjectTemplateMergedConfig(templateConfig);
//         if (mergedObjBase) {
//             const mergedObj = { ...mergedObjBase, ...(mergedObjBase.templateConfig?.renative_json || {}) };

//             // Do not override supportedPlatforms
//             mergedObj.defaults = mergedObj.defaults || {};
//             mergedObj.defaults.supportedPlatforms = c.files.project.config_original?.defaults?.supportedPlatforms;
//             // Do not override engines
//             mergedObj.engines = c.files.project.config_original?.engines;
//             // Set current template
//             if (c.runtime.currentTemplate) {
//                 mergedObj.currentTemplate = c.runtime.currentTemplate;
//             }

//             // mergedObj.isNew = null;
//             delete mergedObj.isNew;
//             delete mergedObj.templateConfig;
//             // c.files.project.config = mergedObj;
//             writeRenativeConfigFile(c.paths.project.config, mergedObj);
//             loadFileExtended(c.files.project, c.paths.project, 'config');
//         }
//     }

//     return true;
// };

const getProjectTemplateMergedConfig = (templateConfig: ConfigFileTemplate | null) => {
    const c = getContext();
    if (c.files.project.config_original && templateConfig) {
        const mergedObj = mergeObjects<ConfigFileTemplate & ConfigFileProject>(
            c,
            templateConfig || {},
            c.files.project.config_original,
            false,
            true
        );
        return mergedObj;
    }
    return null;
};

const _copyIncludedPath = (c: RnvContext, name: string) => {
    const sourcePathOriginal = path.join(c.paths.template.dir, name);
    const sourceOverridePath = path.join(c.paths.template.dir, RnvFolderName.templateOverrides, name);
    const destPath = path.join(c.paths.project.dir, name);
    // If override exists use it, otherwise use original and continue with rest of the logic
    const sourcePath = fsExistsSync(sourceOverridePath) ? sourceOverridePath : sourcePathOriginal;
    if (!fsExistsSync(destPath) && fsExistsSync(sourcePath)) {
        try {
            if (fsLstatSync(sourcePath).isDirectory()) {
                logInfo(`Missing directory ${chalk().bold(`${destPath}.js`)}. COPYING from TEMPATE...DONE`);
                copyFolderContentsRecursiveSync(sourcePath, destPath);
            } else {
                logInfo(`Missing file ${chalk().bold(`${destPath}.js`)}. COPYING from TEMPATE...DONE`);
                copyFileSync(sourcePath, destPath);
            }
        } catch (e) {
            // Get some beer and order hookers
        }
    }
};

export const configureTemplateFiles = async () => {
    logDefault('configureTemplateFiles');

    const c = getContext();

    const templateConfig = readObjectSync<ConfigFileTemplate>(c.paths.template.configTemplate);

    let mergedObj = getProjectTemplateMergedConfig(templateConfig);
    const includedPaths = mergedObj?.templateConfig?.includedPaths;

    if (includedPaths) {
        includedPaths.forEach((pth) => {
            if (c.paths.template.dir) {
                if (typeof pth === 'string') {
                    _copyIncludedPath(c, pth);
                } else {
                    const engId = c.runtime.engine?.config?.id;
                    if (!pth.engines || (engId && pth.engines?.includes?.(engId))) {
                        const incPaths = pth.paths;
                        if (incPaths.length > 0) {
                            incPaths.forEach((pth) => {
                                _copyIncludedPath(c, pth);
                            });
                        }
                    }
                }
            }
        });
    }
};

export const configureEntryPoint = async () => {
    logDefault('configureEntryPoint');
    const c = getContext();

    if (c.buildConfig?.isTemplate) return true;

    const entryFile = getConfigProp('entryFile');

    try {
        const source = path.join(c.paths.template.dir, `${entryFile}.js`);
        const dest = path.join(c.paths.project.dir, `${entryFile}.js`);
        if (!fsExistsSync(dest)) {
            if (!entryFile) {
                logWarning(
                    `Missing entryFile key for ${chalk().bold(c.platform)} platform in your ${chalk().bold(
                        c.paths.appConfig.config
                    )}.`
                );
            } else if (!fsExistsSync(source)) {
                logWarning(
                    `Missing entry file ${chalk().bold(
                        `${entryFile}.js`
                    )}. Not available in your current template. You need to create one manually`
                );
            } else {
                logInfo(`Missing entry file ${chalk().bold(`${entryFile}.js`)}. COPYING from TEMPATE...DONE`);
                copyFileSync(source, dest);
            }
        }
    } catch (e) {
        return Promise.reject(e);
    }

    return true;
};

export const getInstalledTemplateOptions = (): PromptOptions | null => {
    const c = getContext();
    if (c.buildConfig?.isTemplate) return null;
    if (c.buildConfig.templates) {
        return generateOptions(c.buildConfig.templates);
    }
    logError("You don't have any local templates installed", { skipAnalytics: true });
    return null;
};

export const isTemplateInstalled = () => {
    const c = getContext();
    return c.buildConfig.currentTemplate ? doResolve(c.buildConfig.currentTemplate) : false;
};

export const applyTemplate = async (selectedTemplate?: string) => {
    const c = getContext();
    logDefault('applyTemplate', `${c.buildConfig.currentTemplate}=>${selectedTemplate}`);
    if (c.buildConfig?.isTemplate) return true;

    if (!c.files.project.config) {
        logError('Project config not loaded. cannot apply template');

        return false;
    }

    c.runtime.selectedTemplate = selectedTemplate;

    if (!c.buildConfig.currentTemplate) {
        logWarning("You don't have any current template selected");
        const opts = getInstalledTemplateOptions();

        if (opts) {
            const { template } = await inquirerPrompt({
                type: 'list',
                name: 'template',
                message: 'Pick which template to apply',
                choices: opts.keysAsArray,
            });
            c.buildConfig.currentTemplate = template;
            c.files.project.config.currentTemplate = template;
            writeRenativeConfigFile(c.paths.project.config, c.files.project.config);
        } else {
            logError('Could not find any installed templates');
        }
    }

    const templateIsInstalled = doResolve(c.buildConfig.currentTemplate);
    if (!templateIsInstalled) {
        // We Need template to be installed before other dependency resolutions (due to scoping)
        await checkIfProjectAndNodeModulesExists();
    }

    await _applyTemplate(c);
    // await _configureAppConfigs(c);
    // await _configureProjectConfig(c);
    // await _configureRenativeConfig(c);
};
