/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

import {
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_TEMPLATE_NAME
} from '../constants';
import {
    copyFolderContentsRecursiveSync,
    copyFileSync,
    writeFileSync,
    removeDirsSync,
    removeFilesSync,
    mergeObjects,
    readObjectSync
} from '../systemTools/fileutils';
import {
    logToSummary,
    logError,
    logInfo,
    logWarning,
    logTask,
    logDebug
} from '../systemTools/logger';
import { generateOptions } from '../systemTools/prompt';
import {
    setAppConfig,
    listAppConfigsFoldersSync,
    generateBuildConfig,
    generateLocalConfig,
    updateConfig,
    parseRenativeConfigs
} from '../configTools/configParser';
import { doResolve } from '../resolve';

// let templateName = c.buildConfig.currentTemplate;
// if (!templateName) {
//     templateName = 'renative-template-hello-world';
//     logWarning(`You're missing template name in your ${chalk.white(c.paths.project.config)}. ReNative will add default ${chalk.white(templateName)} for you`);
//     c.buildConfig.defaults.template = templateName;
//     fs.writeFileSync(c.paths.project.config, JSON.stringify(c.files.project.config, null, 2));
// }

export const addTemplate = (c, template) => {
    logTask('addTemplate');

    c.files.project.config.templates = c.files.project.config.templates || {};

    if (!c.files.project.config.templates[template]) {
        c.files.project.config.templates[template] = {
            version: 'latest'
        };
    }

    _writeObjectSync(c, c.paths.project.config, c.files.project.config);
};

export const checkIfTemplateInstalled = c => new Promise((resolve) => {
    logTask('checkIfTemplateInstalled');
    if (!c.buildConfig.templates) {
        logWarning(
            `Your ${chalk.white(
                c.paths.project.config
            )} does not contain ${chalk.white(
                'templates'
            )} object. ReNative will skip template generation`
        );
        resolve();
        return;
    }
    Object.keys(c.buildConfig.templates).forEach((k) => {
        const obj = c.buildConfig.templates[k];
        if (
            !doResolve(k.version, false, { basedir: '../' })
              && !doResolve(k, false)
        ) {
            logInfo(
                `Your ${chalk.white(
                    `${k}@${obj.version}`
                )} template is not installed. ReNative will install it for you`
            );
            c._requiresNpmInstall = true;
        }
        if (c.files.project.package.devDependencies) {
            c.files.project.package.devDependencies[k] = obj.version;
        }
    });

    _writeObjectSync(c, c.paths.project.package, c.files.project.package);

    resolve();
});

const _cleanProjectTemplateSync = (c) => {
    logTask('_cleanProjectTemplateSync');
    const dirsToRemove = [
        path.join(c.paths.project.projectConfig.dir),
        path.join(c.paths.project.srcDir),
        path.join(c.paths.project.appConfigsDir)
    ];

    const filesToRemove = c.buildConfig.defaults.supportedPlatforms.map(
        p => path.join(c.paths.project.dir, `index.${p}.js`)
    );

    removeDirsSync(dirsToRemove);
    // TODO: NOT SERVED FROM TEMPLATE YET
    removeFilesSync(filesToRemove);
};

const _applyTemplate = async (c) => {
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
        c.paths.template.dir = doResolve(c.runtime.selectedTemplate);
        // c.paths.template.dir = path.join(c.paths.project.nodeModulesDir, c.runtime.selectedTemplate);
        // }
    } else {
        c.paths.template.dir = doResolve(c.buildConfig.currentTemplate);
        // c.paths.template.dir = path.join(c.paths.project.nodeModulesDir, c.buildConfig.currentTemplate);
    }

    c.paths.template.configTemplate = path.join(
        c.paths.template.dir,
        RENATIVE_CONFIG_TEMPLATE_NAME
    );

    if (!fs.existsSync(c.paths.template.configTemplate)) {
        logWarning(
            `Template file ${chalk.white(
                c.paths.template.configTemplate
            )} does not exist. check your ${chalk.white(
                c.paths.template.dir
            )}. skipping`
        );
        return true;
    }

    logDebug(
        `_applyTemplate:${c.runtime.selectedTemplate}:${c.paths.template.dir}`
    );

    c.paths.template.appConfigsDir = path.join(
        c.paths.template.dir,
        'appConfigs'
    );
    c.paths.template.projectConfigDir = path.join(
        c.paths.template.dir,
        'base'
    );
    c.runtime.currentTemplate = c.files.project.config.currentTemplate;
    if (!c.runtime.currentTemplate) {
        c.runtime.currentTemplate = Object.keys(
            c.files.project.config.templates
        )[0];
        c.runtime.requiresForcedTemplateApply = true;
    }

    await setAppConfig(c, c.runtime.appId);
    generateLocalConfig(c, !!c.runtime.selectedTemplate);

    return true;
};

const _configureSrc = c => new Promise((resolve) => {
    // Check src
    logDebug('configureProject:check src');
    if (!fs.existsSync(c.paths.project.srcDir)) {
        logInfo(
            `Looks like your src folder ${chalk.white(
                c.paths.project.srcDir
            )} is missing! Let's create one for you.`
        );
        copyFolderContentsRecursiveSync(
            path.join(c.paths.template.dir, 'src'),
            c.paths.project.srcDir
        );
    }
    resolve();
});

const _configureAppConfigs = async (c) => {
    // Check appConfigs
    logDebug('configureProject:check appConfigs');
    //
    if (!fs.existsSync(c.paths.project.appConfigsDir)) {
        logInfo(
            `Looks like your appConfig folder ${chalk.white(
                c.paths.project.appConfigsDir
            )} is missing! ReNative will create one from template.`
        );

        // TODO: GET CORRECT PROJECT TEMPLATE
        copyFolderContentsRecursiveSync(
            c.paths.template.appConfigsDir,
            c.paths.project.appConfigsDir
        );

        const appConfigIds = listAppConfigsFoldersSync(c, true);

        // Update App Title to match package.json
        try {
            const supPlats = c.files.project?.config?.defaults?.supportedPlatforms;
            appConfigIds.forEach((v) => {
                const appConfigPath = path.join(
                    c.paths.project.appConfigsDir,
                    v,
                    RENATIVE_CONFIG_NAME
                );
                const appConfig = readObjectSync(appConfigPath);
                if (appConfig) {
                    appConfig.common = appConfig.common || {};
                    if (!c.runtime.isWrapper) {
                        appConfig.common.title = c.files.project.config?.defaults?.title;
                        appConfig.common.id = c.files.project.config?.defaults?.id;
                    }

                    if (supPlats) {
                        Object.keys(appConfig.platforms).forEach((pk) => {
                            if (!supPlats.includes(pk)) {
                                delete appConfig.platforms[pk];
                            }
                        });
                    }

                    _writeObjectSync(c, appConfigPath, appConfig);
                }
            });

            await updateConfig(c, true);
        } catch (e) {
            logError(e);
        }
    }
};

const _configureProjectConfig = c => new Promise((resolve) => {
    // Check projectConfigs
    logDebug('configureProject:check projectConfigs');
    if (!fs.existsSync(c.paths.project.projectConfig.dir)) {
        logInfo(
            `Looks like your projectConfig folder ${chalk.white(
                c.paths.project.projectConfig.dir
            )} is missing! Let's create one for you.`
        );
        copyFolderContentsRecursiveSync(
            c.paths.template.projectConfigDir,
            c.paths.project.projectConfig.dir
        );
    }
    resolve();
});

const _configureRenativeConfig = async (c) => {
    // renative.json
    const templateConfig = readObjectSync(c.paths.template.configTemplate);
    logDebug('configureProject:check renative.json');

    //     const missingPlugins = {};
    //     const supPlats = c.files.project?.config?.defaults?.supportedPlatforms;
    //     if (supPlats) {
    //         supPlats.forEach((pk) => {
    //             const selectedEngine = getEngineByPlatform(c, pk);
    //             if (selectedEngine?.plugins) {
    //                 const ePlugins = Object.keys(selectedEngine.plugins);
    //
    //                 if (ePlugins?.length) {
    //                     ePlugins.forEach((pluginKey) => {
    //                         if (!c.buildConfig?.plugins?.[pluginKey]) {
    //                             missingPlugins[pluginKey] = { key: pluginKey, plugin: selectedEngine.plugins[pluginKey], engine: selectedEngine.id };
    //                         }
    //                     });
    //                 }
    //             }
    //         });
    //     }
    //
    //     const missingPluginsArr = Object.values(missingPlugins);
    //     const involvedEngines = {};
    //     if (missingPluginsArr.length) {
    //         c.runtime.requiresForcedTemplateApply = true;
    //
    //         missingPluginsArr.forEach(({ key, plugin, engine }) => {
    //             templateConfig.plugins[key] = plugin;
    //             involvedEngines[engine] = true;
    //         });
    //
    //         logInfo(`Adding following plugins required by ${chalk.white(Object.keys(involvedEngines).join(', '))} engines:
    // ${chalk.white(missingPluginsArr.map(v => v.key).join(', '))}`);
    //     }

    if (!c.runtime.isWrapper) {
        if (
            c.runtime.selectedTemplate
            || c.runtime.requiresForcedTemplateApply
            || c.files.project.config.isNew
        ) {
            logWarning(
                `Looks like your ${
                    c.paths.project.config
                } need to be updated with ${c.paths.template.configTemplate}`
            );
            const mergedObj = mergeObjects(
                c,
                c.files.project.config,
                templateConfig,
                false,
                true
            );
            mergedObj.currentTemplate = c.runtime.currentTemplate;
            mergedObj.isNew = null;
            delete mergedObj.isNew;
            c.files.project.config = mergedObj;
            _writeObjectSync(c, c.paths.project.config, mergedObj);
        }
    } else {
        // if (templateConfig.plugins.renative) {
        //     templateConfig.plugins.renative = getLocalRenativePlugin();
        // }
        templateConfig.plugins.renative = {
            webpack: {
                modulePaths: [
                    {
                        projectPath: '../../packages/renative'
                    }
                ],
                moduleAliases: {
                    renative: {
                        projectPath: '../../packages/renative'
                    }
                }
            }
        };

        _writeObjectSync(c, c.paths.project.configLocal, templateConfig);
    }
    return true;
};

const _parseSupportedPlatforms = async (c, callback) => {
    if (!c.buildConfig.platforms) {
        await parseRenativeConfigs(c);
    }
    const p = Object.keys(c.buildConfig.platforms);
    const pLen = p.length;
    const supportedPlatforms = c.buildConfig.defaults?.supportedPlatforms;
    for (let i = 0; i < pLen; i++) {
        const k = p[i];

        const plat = c.buildConfig.platforms[k];
        const platKeysNum = plat !== undefined ? Object.keys(plat).length : 0;

        if ((supportedPlatforms && supportedPlatforms.includes(k)) || !supportedPlatforms) {
            callback(k, plat);
        } else if (platKeysNum > 1) {
            // Every platform comes always at least with engine prop so let's check for more
            logWarning(
                `Extra platform ${chalk.white(
                    k
                )} will be ignored because it's not configured in your ${chalk.white(
                    './renative.json: { defaults.supportedPlatforms }'
                )} object.`
            );
        }
    }
    return true;
};

export const configureEntryPoints = async (c) => {
    logTask('configureEntryPoints');
    // Check entry
    // TODO: RN bundle command fails if entry files are not at root
    // logDebug('configureProject:check entry');
    // if (!fs.existsSync(c.paths.entryDir)) {
    //     logWarning(`Looks like your entry folder ${chalk.white(c.paths.entryDir)} is missing! Let's create one for you.`);
    copyFolderContentsRecursiveSync(
        path.join(c.paths.rnv.dir, 'entry'),
        c.paths.entryDir
    );
    // }

    try {
        if (!fs.existsSync(c.paths.appConfig.config)) {
            logWarning(
                `c.paths.appConfig.config at path: ${
                    c.paths.appConfig.config
                } does not exist. ReNative will regenerate renative.local.json`
            );
            return true;
        }
        await _parseSupportedPlatforms(c, (platform, plat) => {
            const source = path.join(
                c.paths.template.dir,
                `${plat.entryFile}.js`
            );
            const backupSource = path.join(
                c.paths.rnv.projectTemplate.dir,
                'entry',
                `${plat.entryFile}.js`
            );
            const dest = path.join(c.paths.project.dir, `${plat.entryFile}.js`);
            if (!fs.existsSync(dest)) {
                if (!plat.entryFile) {
                    logWarning(
                        `You missing entryFile key for ${chalk.white(
                            platform
                        )} platform in your ${chalk.white(
                            c.paths.appConfig.config
                        )}.`
                    );
                } else if (!fs.existsSync(source)) {
                    logInfo(
                        `You missing entry file ${chalk.white(
                            source
                        )} in your template. ReNative Will use default backup entry from ${chalk.white(
                            backupSource
                        )}!`
                    );
                    copyFileSync(backupSource, dest);
                } else {
                    logInfo(
                        `You missing entry file ${chalk.white(
                            plat.entryFile
                        )} in your project. let's create one for you!`
                    );
                    copyFileSync(source, dest);
                }
            }
        });
    } catch (e) {
        return Promise.reject(e);
    }

    return true;
};

const _writeObjectSync = (c, p, s) => {
    writeFileSync(p, s);
    generateBuildConfig(c);
};

export const getTemplateOptions = c => generateOptions(
    c.buildConfig.projectTemplates,
    false,
    null,
    (i, obj, mapping, defaultVal) => {
        const exists = c.buildConfig.templates?.[defaultVal];
        const installed = exists ? chalk.yellow(' (installed)') : '';
        return ` [${chalk.grey(i + 1)}]> ${chalk.bold(
            defaultVal
        )}${installed} \n`;
    }
);

export const getInstalledTemplateOptions = (c) => {
    if (c.buildConfig.templates) {
        return generateOptions(c.buildConfig.templates);
    }
    logError("You don't have any local templates installed", false, true);
    return [];
};

export const rnvTemplateList = c => new Promise((resolve) => {
    logTask('rnvTemplateList');
    const opts = getTemplateOptions(c);
    logToSummary(`Templates:\n\n${opts.asString}`);
    resolve();
});

export const rnvTemplateAdd = async (c) => {
    logTask('rnvTemplateAdd');

    const opts = getTemplateOptions(c);

    const { template } = await inquirer.prompt({
        type: 'list',
        message: 'Pick which template to install',
        name: 'template',
        choices: opts.keysAsArray
    });

    addTemplate(c, template);
};

export const applyTemplate = async (c, selectedTemplate) => {
    logTask(
        'applyTemplate', `${c.buildConfig.currentTemplate}=>${selectedTemplate}`
    );
    c.runtime.selectedTemplate = selectedTemplate;

    if (!c.buildConfig.currentTemplate) {
        logWarning("You don't have any current template selected");
        const opts = getInstalledTemplateOptions(c);

        const { template } = await inquirer.prompt({
            type: 'list',
            name: 'template',
            message: 'Pick which template to apply',
            choices: opts.keysAsArray
        });

        c.buildConfig.currentTemplate = template;
        c.files.project.config.currentTemplate = template;
        _writeObjectSync(c, c.paths.project.config, c.files.project.config);
    }

    await _applyTemplate(c);
    await _configureSrc(c);
    await _configureAppConfigs(c);
    await _configureProjectConfig(c);
    await _configureRenativeConfig(c);
    await configureEntryPoints(c);
};

export const rnvTemplateApply = async (c) => {
    logTask(`rnvTemplateApply:${c.program.template}`);

    if (c.program.template) {
        return applyTemplate(c, c.program.template);
    }
    const opts = getInstalledTemplateOptions(c);

    const { template } = await inquirer.prompt({
        type: 'list',
        message: 'Pick which template to install',
        name: 'template',
        choices: opts.keysAsArray
    });

    applyTemplate(c, template);
};
