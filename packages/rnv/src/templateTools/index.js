import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

import { RENATIVE_CONFIG_NAME, RENATIVE_CONFIG_TEMPLATE_NAME } from '../constants';
import {
    copyFolderContentsRecursiveSync,
    copyFileSync, writeFileSync, removeDirsSync,
    removeFilesSync, mergeObjects, readObjectSync
} from '../systemTools/fileutils';
import { logToSummary, logError, logInfo, logWarning, logTask } from '../systemTools/logger';
import { getLocalRenativePlugin } from '../pluginTools';
import { generateOptions } from '../systemTools/prompt';
import { setAppConfig, listAppConfigsFoldersSync, generateBuildConfig, generateLocalConfig, updateConfig } from '../configTools/configParser';


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

export const checkIfTemplateInstalled = c => new Promise((resolve, reject) => {
    logTask('checkIfTemplateInstalled');
    if (!c.buildConfig.templates) {
        logWarning(`Your ${chalk.white(c.paths.project.config)} does not contain ${chalk.white('templates')} object. ReNative will skip template generation`);
        resolve();
        return;
    }

    for (const k in c.buildConfig.templates) {
        let t = k;
        const obj = c.buildConfig.templates[k];
        if (k.version && k.version.startsWith('file:')) {
            t = `../${k.version.replace('file:', '')}`;
        }
        const templateFolder = path.join(c.paths.project.nodeModulesDir, k);
        if (!fs.existsSync(templateFolder)) {
            logWarning(`Your ${chalk.white(templateFolder)} template is not installed. ReNative will install it for you`);
            // npmInstall(c).then(() => resolve()).catch(e => reject(e));
            // return;
            c._requiresNpmInstall = true;
        }
        if (c.files.project.package.devDependencies) {
            c.files.project.package.devDependencies[k] = obj.version;
        }
    }
    _writeObjectSync(c, c.paths.project.package, c.files.project.package);

    resolve();
});

export const applyTemplate = async (c, selectedTemplate) => {
    logTask(`applyTemplate:${c.buildConfig.currentTemplate}=>${selectedTemplate}:`);
    c.runtime.selectedTemplate = selectedTemplate;

    if (!c.buildConfig.currentTemplate) {
        logWarning('You don\'t have any current template selected');
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

const _cleanProjectTemplateSync = (c) => {
    logTask('_cleanProjectTemplateSync');
    const dirsToRemove = [
        path.join(c.paths.project.projectConfig.dir),
        path.join(c.paths.project.srcDir),
        path.join(c.paths.project.appConfigsDir)
    ];

    const filesToRemove = c.buildConfig.defaults.supportedPlatforms.map(p => path.join(c.paths.project.dir, `index.${p}.js`));

    removeDirsSync(dirsToRemove);
    // TODO: NOT SERVED FROM TEMPLATE YET
    removeFilesSync(filesToRemove);
};

const _applyTemplate = async (c) => {
    logTask(`_applyTemplate:${c.runtime.selectedTemplate}`);

    if (c.runtime.selectedTemplate) {
        _cleanProjectTemplateSync(c);
        if (c.runtime.isWrapper) {
            c.paths.template.dir = path.join(c.paths.project.dir, 'packages', c.runtime.selectedTemplate);
        } else {
            c.paths.template.dir = path.join(c.paths.project.nodeModulesDir, c.runtime.selectedTemplate);
        }
    } else {
        c.paths.template.dir = path.join(c.paths.project.nodeModulesDir, c.buildConfig.currentTemplate);
    }

    c.paths.template.configTemplate = path.join(c.paths.template.dir, RENATIVE_CONFIG_TEMPLATE_NAME);

    if (!fs.existsSync(c.paths.template.configTemplate)) {
        logWarning(`Template file ${chalk.white(c.paths.template.configTemplate)} does not exist. check your ${chalk.white(c.paths.template.dir)}. skipping`);
        return true;
    }

    logTask(`_applyTemplate:${c.runtime.selectedTemplate}:${c.paths.template.dir}`, chalk.grey);

    c.paths.template.appConfigsDir = path.join(c.paths.template.dir, 'appConfigs');
    c.paths.template.projectConfigDir = path.join(c.paths.template.dir, 'projectConfig');
    c.runtime.currentTemplate = c.files.project.config.currentTemplate;
    if (!c.runtime.currentTemplate) {
        c.runtime.currentTemplate = Object.keys(c.files.project.config.templates)[0];
        c.runtime.requiresForcedTemplateApply = true;
    }

    await setAppConfig(c, c.runtime.appId);
    generateLocalConfig(c, !!c.runtime.selectedTemplate);

    return true;
};

const _configureSrc = c => new Promise((resolve, reject) => {
    // Check src
    logTask('configureProject:check src', chalk.grey);
    if (!fs.existsSync(c.paths.project.srcDir)) {
        logInfo(`Looks like your src folder ${chalk.white(c.paths.project.srcDir)} is missing! Let's create one for you.`);
        copyFolderContentsRecursiveSync(path.join(c.paths.template.dir, 'src'), c.paths.project.srcDir);
    }
    resolve();
});


const _configureAppConfigs = async (c) => {
    // Check appConfigs
    logTask('configureProject:check appConfigs', chalk.grey);
    //
    if (!fs.existsSync(c.paths.project.appConfigsDir)) {
        logInfo(
            `Looks like your appConfig folder ${chalk.white(
                c.paths.project.appConfigsDir,
            )} is missing! ReNative will create one from template.`,
        );

        // TODO: GET CORRECT PROJECT TEMPLATE
        copyFolderContentsRecursiveSync(c.paths.template.appConfigsDir, c.paths.project.appConfigsDir);

        const appConfigIds = listAppConfigsFoldersSync(c, true);

        // Update App Title to match package.json
        try {
            appConfigIds.forEach((v) => {
                const appConfigPath = path.join(c.paths.project.appConfigsDir, v, RENATIVE_CONFIG_NAME);
                const appConfig = readObjectSync(appConfigPath);
                if (appConfig) {
                    appConfig.common = appConfig.common || {};
                    if (!c.runtime.isWrapper) {
                        appConfig.common.title = c.files.project.config?.defaults?.title;
                        appConfig.common.id = c.files.project.config?.defaults?.id;
                    }

                    _writeObjectSync(c, appConfigPath, appConfig);
                }
            });

            const supPlats = c.files.project?.defaults?.supportedPlatforms;

            if (supPlats) {
                for (const pk in appConfig.platforms) {
                    if (!supPlats.includes(pk)) {
                        delete appConfig.platforms[pk];
                    }
                }
            }
            await updateConfig(c, true);
        } catch (e) {
            logError(e);
        }
    }
};

const _configureProjectConfig = c => new Promise((resolve, reject) => {
    // Check projectConfigs
    logTask('configureProject:check projectConfigs', chalk.grey);
    if (!fs.existsSync(c.paths.project.projectConfig.dir)) {
        logInfo(
            `Looks like your projectConfig folder ${chalk.white(c.paths.project.projectConfig.dir)} is missing! Let's create one for you.`,
        );
        copyFolderContentsRecursiveSync(c.paths.template.projectConfigDir, c.paths.project.projectConfig.dir);
    }
    resolve();
});

const _configureRenativeConfig = c => new Promise((resolve, reject) => {
    // renative.json
    const templateConfig = readObjectSync(c.paths.template.configTemplate);
    logTask('configureProject:check renative.json', chalk.grey);
    if (!c.runtime.isWrapper) {
        if (c.runtime.selectedTemplate || c.runtime.requiresForcedTemplateApply || c.files.project.config.isNew) {
            logWarning(
                `Looks like your ${c.paths.project.config} need to be updated with ${c.paths.template.configTemplate}`,
            );
            const mergedObj = mergeObjects(c, c.files.project.config, templateConfig, false, true);
            mergedObj.currentTemplate = c.runtime.currentTemplate;
            mergedObj.isNew = null;
            delete mergedObj.isNew;
            c.files.project.config = mergedObj;
            _writeObjectSync(c, c.paths.project.config, mergedObj);
        }
    } else {
        if (templateConfig.plugins.renative) {
            templateConfig.plugins.renative = getLocalRenativePlugin();
        }
        _writeObjectSync(c, c.paths.project.configLocal, templateConfig);
    }
    resolve();
});

export const configureEntryPoints = c => new Promise((resolve, reject) => {
    logTask('configureEntryPoints');
    // Check entry
    // TODO: RN bundle command fails if entry files are not at root
    // logTask('configureProject:check entry');
    // if (!fs.existsSync(c.paths.entryDir)) {
    //     logWarning(`Looks like your entry folder ${chalk.white(c.paths.entryDir)} is missing! Let's create one for you.`);
    //     copyFolderContentsRecursiveSync(path.join(c.paths.rnv.dir, 'entry'), c.paths.entryDir);
    // }

    try {
        if (!fs.existsSync(c.paths.appConfig.config)) {
            logWarning(`ERROR: c.paths.appConfig.config: ${c.paths.appConfig.config} does not exist`);
            resolve();
            return;
        }
        let plat;
        const p = c.buildConfig.platforms;
        const supportedPlatforms = c.buildConfig.defaults?.supportedPlatforms;
        for (const k in p) {
            if (supportedPlatforms && supportedPlatforms.includes(k) || !supportedPlatforms) {
                plat = p[k];
                const source = path.join(c.paths.template.dir, `${plat.entryFile}.js`);
                const backupSource = path.join(c.paths.rnv.projectTemplate.dir, 'entry', `${plat.entryFile}.js`);
                const dest = path.join(c.paths.project.dir, `${plat.entryFile}.js`);
                if (!fs.existsSync(dest)) {
                    if (!plat.entryFile) {
                        logWarning(`You missing entryFile for ${chalk.white(k)} platform in your ${chalk.white(c.paths.appConfig.config)}.`);
                    } else if (!fs.existsSync(source)) {
                        logInfo(`You missing entry file ${chalk.white(source)} in your template. ReNative Will use default backup entry from ${chalk.white(backupSource)}!`);
                        copyFileSync(backupSource, dest);
                    } else {
                        logInfo(`You missing entry file ${chalk.white(plat.entryFile)} in your project. let's create one for you!`);
                        copyFileSync(source, dest);
                    }
                }
            } else {
                logWarning(`Extra platform ${chalk.white(k)} will be ignored because it's not configured in your ${chalk.white('./renative.json: { defaults.supportedPlatforms }')} object.`);
            }
        }
    } catch (e) {
        reject();
        return;
    }

    resolve();
});

const _writeObjectSync = (c, p, s) => {
    writeFileSync(p, s);
    generateBuildConfig(c);
};

export const getTemplateOptions = c => generateOptions(c.buildConfig.projectTemplates, false, null, (i, obj, mapping, defaultVal) => {
    const exists = c.buildConfig.templates?.[defaultVal];
    const installed = exists ? chalk.yellow(' (installed)') : '';
    return ` [${chalk.grey(i + 1)}]> ${chalk.bold(defaultVal)}${installed} \n`;
});

export const getInstalledTemplateOptions = (c) => {
    if (c.buildConfig.templates) {
        return generateOptions(c.buildConfig.templates);
    }
    logError('You don\'t have any local templates installed', false, true);
    return [];
};


export const rnvTemplateList = c => new Promise((resolve, reject) => {
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
