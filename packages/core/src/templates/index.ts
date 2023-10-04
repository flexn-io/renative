import path from 'path';
import { RENATIVE_CONFIG_NAME, RENATIVE_CONFIG_TEMPLATE_NAME } from '../constants';
import {
    copyFolderContentsRecursiveSync,
    copyFileSync,
    writeFileSync,
    removeDirsSync,
    removeFilesSync,
    mergeObjects,
    readObjectSync,
    fsExistsSync,
    fsLstatSync,
    fsUnlinkSync,
    removeDirSync,
} from '../system/fs';
import { chalk, logError, logInfo, logWarning, logTask, logDebug } from '../logger';
import { getConfigProp } from '../common';
import { listAppConfigsFoldersSync, generateBuildConfig, loadFileExtended } from '../configs';
import { doResolve } from '../system/resolve';
import { checkIfProjectAndNodeModulesExists } from '../npm';
import { RnvContext } from '../context/types';
import { generateOptions, inquirerPrompt } from '../api';
import { PromptOptions } from '../api/types';

export const checkIfTemplateConfigured = async (c: RnvContext) => {
    logTask('checkIfTemplateConfigured');
    if (c.program.skipDependencyCheck || c.files.project.config.isTemplate) return true;
    if (!c.buildConfig.templates) {
        logWarning(
            `Your ${chalk().white(c.paths.project.config)} does not contain ${chalk().white(
                'templates'
            )} object. ReNative will skip template generation`
        );
        return false;
    }
    Object.keys(c.buildConfig.templates).forEach((k) => {
        const obj = c.buildConfig.templates?.[k] || { version: 'unknown template version' };
        if (!doResolve(k, false, { basedir: '../' }) && !doResolve(k, false)) {
            logInfo(
                `Your ${chalk().white(`${k}@${obj.version}`)} template is missing in renative.json. CONFIGURING...DONE`
            );
            c._requiresNpmInstall = true;
            c.runtime.requiresBootstrap = true;
        }
        if (c.files.project.package.devDependencies) {
            if (c.files.project.package.devDependencies[k] !== obj.version) {
                logInfo(`Updating template ${chalk().white(`${k}`)} => ${chalk().green(obj.version)}. ...DONE`);
            }

            c.files.project.package.devDependencies[k] = obj.version;
        }
    });

    _writeObjectSync(c, c.paths.project.package, c.files.project.package);

    return true;
};

const _cleanProjectTemplateSync = (c: RnvContext) => {
    logTask('_cleanProjectTemplateSync');
    const dirsToRemove = [c.paths.project.appConfigBase.dir, c.paths.project.srcDir!, c.paths.project.appConfigsDir];

    const filesToRemove = c.buildConfig.defaults?.supportedPlatforms?.map((p) =>
        path.join(c.paths.project.dir, `index.${p}.js`)
    );

    removeDirsSync(dirsToRemove);
    // TODO: NOT SERVED FROM TEMPLATE YET
    if (filesToRemove) removeFilesSync(filesToRemove);
};

const _applyTemplate = async (c: RnvContext) => {
    logTask('_applyTemplate', `current:${c.buildConfig.currentTemplate} selected:${c.runtime.selectedTemplate}`);

    if (c.runtime.selectedTemplate) {
        _cleanProjectTemplateSync(c);
        // if (isMonorepo()) {
        //     // @todo - have the templates report their absolute locations
        //     c.paths.template.dir = path.join(
        //         getMonorepoRoot(),
        //         'packages',
        //         c.runtime.selectedTemplate
        //     );
        // } else {
        c.paths.template.dir = doResolve(c.runtime.selectedTemplate) || 'Error: unresolved';
        // c.paths.template.dir = path.join(c.paths.project.nodeModulesDir, c.runtime.selectedTemplate);
        // }
    } else {
        c.paths.template.dir = doResolve(c.buildConfig.currentTemplate) || 'Error: unresolved';
        // c.paths.template.dir = path.join(c.paths.project.nodeModulesDir, c.buildConfig.currentTemplate);
    }

    if (c.paths.template.dir) {
        c.paths.template.configTemplate = path.join(c.paths.template.dir, RENATIVE_CONFIG_TEMPLATE_NAME);

        c.paths.template.config = path.join(c.paths.template.dir, RENATIVE_CONFIG_NAME);
    }

    // if (fsExistsSync(c.paths.template.config)) {
    //     c.files.template.config = readObjectSync(c.paths.template.config);
    // }

    if (!fsExistsSync(c.paths.template.configTemplate)) {
        logWarning(
            `Template file ${chalk().white(c.paths.template.configTemplate)} does not exist. check your ${chalk().white(
                c.paths.template.dir
            )}. skipping`
        );
        return true;
    }

    logDebug(`_applyTemplate:${c.runtime.selectedTemplate}:${c.paths.template.dir}`);

    if (c.paths.template.dir) c.paths.template.appConfigsDir = path.join(c.paths.template.dir, 'appConfigs');
    c.paths.template.appConfigBase.dir = path.join(c.paths.template.appConfigsDir, 'base');
    c.runtime.currentTemplate = c.files.project.config.currentTemplate;
    if (!c.runtime.currentTemplate) {
        c.runtime.currentTemplate = Object.keys(c.files.project.config.templates)[0];
        c.runtime.requiresForcedTemplateApply = true;
    }

    if (c.buildConfig.currentTemplate) {
        c.runtime.activeTemplate = `${c.buildConfig.currentTemplate}@${
            c.buildConfig.templates?.[c.buildConfig.currentTemplate]?.version
        }`;
    }

    return true;
};

const _configureSrc = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        // Check src
        logDebug('configureProject:check src');
        if (!fsExistsSync(c.paths.project.srcDir)) {
            logInfo(`Your src folder ${chalk().white(c.paths.project.srcDir)} is missing! CREATING...DONE`);
            copyFolderContentsRecursiveSync(path.join(c.paths.template.dir, 'src'), c.paths.project.srcDir);
        }
        resolve();
    });

const _configureAppConfigs = async (c: RnvContext) => {
    // Check appConfigs
    logDebug('configureProject:check appConfigs');
    //
    if (!fsExistsSync(c.paths.project.appConfigsDir)) {
        logInfo(
            `Your appConfig folder ${chalk().white(
                c.paths.project.appConfigsDir
            )} is missing! ReNative will create one from template.`
        );

        // TODO: GET CORRECT PROJECT TEMPLATE
        copyFolderContentsRecursiveSync(c.paths.template.appConfigsDir, c.paths.project.appConfigsDir);

        const appConfigIds = listAppConfigsFoldersSync(c, false);

        // Update App Title to match package.json
        try {
            const supPlats = c.files.project?.config?.defaults?.supportedPlatforms;
            appConfigIds.forEach((v) => {
                const appConfigPath = path.join(c.paths.project.appConfigsDir, v, RENATIVE_CONFIG_NAME);
                const appConfig = readObjectSync(appConfigPath);
                if (appConfig) {
                    if (appConfig.skipBootstrapCopy) {
                        fsUnlinkSync(appConfigPath);
                        if (v !== 'base') {
                            removeDirSync(path.join(c.paths.project.appConfigsDir, v));
                        }
                    } else if (!appConfig.hidden) {
                        appConfig.common = appConfig.common || {};
                        appConfig.common.title = c.files.project.config?.defaults?.title;
                        appConfig.common.id = c.files.project.config?.defaults?.id;

                        if (supPlats) {
                            Object.keys(appConfig.platforms).forEach((pk) => {
                                if (!supPlats.includes(pk)) {
                                    delete appConfig.platforms[pk];
                                }
                            });
                        }

                        _writeObjectSync(c, appConfigPath, appConfig);
                    }
                }
            });
        } catch (e: any) {
            logError(e);
        }
    }
};

const _configureProjectConfig = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        // Check projectConfigs
        logDebug('configureProject:check projectConfigs');
        if (!fsExistsSync(c.paths.project.appConfigBase.dir)) {
            logInfo(
                `Your projectConfig folder ${chalk().white(
                    c.paths.project.appConfigBase.dir
                )} is missing! CREATING...DONE`
            );
            copyFolderContentsRecursiveSync(c.paths.template.appConfigBase.dir, c.paths.project.appConfigBase.dir);
        }
        resolve();
    });

const _configureRenativeConfig = async (c: RnvContext) => {
    // renative.json
    const templateConfig = readObjectSync(c.paths.template.configTemplate);
    logDebug('configureProject:check renative.json');

    if (c.runtime.selectedTemplate || c.runtime.requiresForcedTemplateApply || c.files.project.config.isNew) {
        logInfo(
            `Your ${c.paths.project.config} needs to be updated with ${c.paths.template.configTemplate}. UPDATING...DONE`
        );
        const mergedObj = mergeObjects(c, templateConfig, c.files.project.config_original, false, true);
        // Do not override supportedPlatforms
        mergedObj.defaults.supportedPlatforms = c.files.project.config_original.defaults.supportedPlatforms;
        // Do not override engines
        mergedObj.engines = c.files.project.config_original.engines;
        // Set current template
        mergedObj.currentTemplate = c.runtime.currentTemplate;
        if (mergedObj.isNew) {
            c.runtime.isFirstRunAfterNew = true;
        }
        // mergedObj.isNew = null;
        delete mergedObj.isNew;
        delete mergedObj.templateConfig;
        // c.files.project.config = mergedObj;
        _writeObjectSync(c, c.paths.project.config, mergedObj);
        loadFileExtended(c, c.files.project, c.paths.project, 'config');
    }

    return true;
};

export const configureTemplateFiles = async (c: RnvContext) => {
    logTask('configureTemplateFiles');

    const templateConfig = readObjectSync(c.paths.template.configTemplate);

    const includedPaths = templateConfig?.templateConfig?.includedPaths;
    if (includedPaths) {
        includedPaths.forEach((name: string) => {
            if (c.paths.template.dir) {
                const sourcePath = path.join(c.paths.template.dir, name);
                const destPath = path.join(c.paths.project.dir, name);
                if (!fsExistsSync(destPath) && fsExistsSync(sourcePath)) {
                    try {
                        if (fsLstatSync(sourcePath).isDirectory()) {
                            logInfo(
                                `Missing directory ${chalk().white(`${destPath}.js`)}. COPYING from TEMPATE...DONE`
                            );
                            copyFolderContentsRecursiveSync(sourcePath, destPath);
                        } else {
                            logInfo(`Missing file ${chalk().white(`${destPath}.js`)}. COPYING from TEMPATE...DONE`);
                            copyFileSync(sourcePath, destPath);
                        }
                    } catch (e) {
                        // Get some beer and order hookers
                    }
                }
            }
        });
    }
};

export const configureEntryPoint = async (c: RnvContext, platform: string) => {
    logTask('configureEntryPoint');

    if (c.files.project.config.isTemplate) return true;

    const entryFile = getConfigProp(c, platform, 'entryFile');

    try {
        const source = path.join(c.paths.template.dir, `${entryFile}.js`);
        const dest = path.join(c.paths.project.dir, `${entryFile}.js`);
        if (!fsExistsSync(dest)) {
            if (!entryFile) {
                logWarning(
                    `Missing entryFile key for ${chalk().white(c.platform)} platform in your ${chalk().white(
                        c.paths.appConfig.config
                    )}.`
                );
            } else if (!fsExistsSync(source)) {
                logWarning(
                    `Missing entry file ${chalk().white(
                        `${entryFile}.js`
                    )}. Not available in your current template. You need to create one manually`
                );
            } else {
                logInfo(`Missing entry file ${chalk().white(`${entryFile}.js`)}. COPYING from TEMPATE...DONE`);
                copyFileSync(source, dest);
            }
        }
    } catch (e) {
        return Promise.reject(e);
    }

    return true;
};

const _writeObjectSync = (c: RnvContext, p: string | undefined, s: string) => {
    writeFileSync(p, s);
    generateBuildConfig(c);
};

export const getTemplateOptions = (c: RnvContext, isGlobalScope?: boolean) => {
    let defaultProjectTemplates;
    if (isGlobalScope) {
        defaultProjectTemplates = c.files.rnv.projectTemplates.config.projectTemplates;
    } else {
        defaultProjectTemplates = c.buildConfig.projectTemplates || {};
    }

    return generateOptions(defaultProjectTemplates, false, null, (i, obj, mapping, defaultVal) => {
        const exists = c.buildConfig.templates?.[defaultVal];
        const installed = exists ? chalk().yellow(' (installed)') : '';
        return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)}${installed} \n`;
    });
};

export const getInstalledTemplateOptions = (c: RnvContext): PromptOptions | null => {
    if (c.files.project.config.isTemplate) return null;
    if (c.buildConfig.templates) {
        return generateOptions(c.buildConfig.templates);
    }
    logError("You don't have any local templates installed", false, true);
    return null;
};

export const isTemplateInstalled = (c: RnvContext) =>
    c.buildConfig.currentTemplate ? doResolve(c.buildConfig.currentTemplate) : false;

export const applyTemplate = async (c: RnvContext, selectedTemplate?: string) => {
    logTask('applyTemplate', `${c.buildConfig.currentTemplate}=>${selectedTemplate}`);
    if (c.files.project.config.isTemplate) return true;

    c.runtime.selectedTemplate = selectedTemplate;

    if (!c.buildConfig.currentTemplate) {
        logWarning("You don't have any current template selected");
        const opts = getInstalledTemplateOptions(c);

        if (opts) {
            const { template } = await inquirerPrompt({
                type: 'list',
                name: 'template',
                message: 'Pick which template to apply',
                choices: opts.keysAsArray,
            });
            c.buildConfig.currentTemplate = template;
            c.files.project.config.currentTemplate = template;
            _writeObjectSync(c, c.paths.project.config, c.files.project.config);
        } else {
            logError('Could not find any installed templates');
        }
    }

    const templateIsInstalled = doResolve(c.buildConfig.currentTemplate);
    if (!templateIsInstalled) {
        // We Need template to be installed before other dependency resolutions (due to scoping)
        await checkIfProjectAndNodeModulesExists(c);
    }

    await _applyTemplate(c);
    await _configureSrc(c);
    await _configureAppConfigs(c);
    await _configureProjectConfig(c);
    await _configureRenativeConfig(c);
};
