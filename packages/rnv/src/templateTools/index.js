import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import merge from 'deepmerge';
import { RENATIVE_CONFIG_NAME, RENATIVE_CONFIG_TEMPLATE_NAME } from '../constants';
import { executeAsync } from '../systemTools/exec';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, writeObjectSync, removeDirsSync, removeDirs,
    removeFilesSync, mergeObjects, readObjectSync
} from '../systemTools/fileutils';
import { logError, logInfo, logWarning, logTask } from '../common';
import { getMergedPlugin, getLocalRenativePlugin } from '../pluginTools';
import { generateOptions } from '../systemTools/prompt';
import { configureEntryPoints, npmInstall } from '../projectTools/projectParser';
import { setAppConfig, listAppConfigsFoldersSync, generateBuildConfig } from '../configTools/configParser';

import { templates } from '../../renativeTemplates/templates.json';


// let templateName = c.buildConfig.currentTemplate;
// if (!templateName) {
//     templateName = 'renative-template-hello-world';
//     logWarning(`You're missing template name in your ${chalk.white(c.paths.project.config)}. ReNative will add default ${chalk.white(templateName)} for you`);
//     c.buildConfig.defaults.template = templateName;
//     fs.writeFileSync(c.paths.project.config, JSON.stringify(c.files.project.config, null, 2));
// }

export const listTemplates = c => new Promise((resolve, reject) => {
    logTask('listTemplates');
    const opts = generateOptions(templates);
    console.log(opts.asString);
    resolve();
});

export const addTemplate = (c, opts) => new Promise((resolve, reject) => {
    logTask('addTemplate');
    const { maxErrorLength } = c.program;

    c.files.project.config.templates = c.files.project.config.templates || {};

    if (!c.files.project.config.templates[opts.selectedOption]) {
        c.files.project.config.templates[opts.selectedOption] = {
            version: 'latest'
        };
    }

    writeObjectSync(c.paths.project.config, c.files.project.config);


    resolve();
});

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
    writeObjectSync(c.paths.project.package, c.files.project.package);

    resolve();
});

export const applyLocalTemplate = (c, selectedTemplate) => new Promise((resolve, reject) => {
    logTask(`applyLocalTemplate:${selectedTemplate}`);
    const currentTemplate = c.buildConfig.currentTemplate;
    if (selectedTemplate) {
        logTask(`applyTemplate:${selectedTemplate}`);
        // LOCAL TEMPLATE
        if (currentTemplate !== selectedTemplate) {
            logWarning(`Current template ${chalk.red(currentTemplate)} will be overriden by ${chalk.green(selectedTemplate)}`);
        }

        const dirsToRemove = [
            path.join(c.paths.project.projectConfig.dir),
            path.join(c.paths.project.srcDir),
            path.join(c.paths.project.appConfigsDir)
        ];

        const filesToRemove = c.buildConfig.defaults.supportedPlatforms.map(p => path.join(c.paths.project.dir, `index.${p}.js`));

        removeDirsSync(dirsToRemove);
        // TODO: NOT SERVED FROM TEMPLATE YET
        removeFilesSync(filesToRemove);

        c.paths.projectTemplateFolder = path.join(c.paths.project.nodeModulesDir, selectedTemplate);

        _applyTemplate(c)
            .then(() => configureEntryPoints(c))
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

export const applyTemplate = c => new Promise((resolve, reject) => {
    logTask('applyTemplate');

    c.paths.projectTemplateFolder = path.join(c.paths.project.nodeModulesDir, c.buildConfig.currentTemplate);

    _applyTemplate(c)
        // .then(() => configureEntryPoints(c)) // NOT READY YET
        .then(() => resolve())
        .catch(e => reject(e));
});

const _applyTemplate = c => new Promise((resolve, reject) => {
    logTask(`_applyTemplate:${c.paths.projectTemplateFolder}`);

    const templateConfigPath = path.join(c.paths.projectTemplateFolder, RENATIVE_CONFIG_TEMPLATE_NAME);

    if (!fs.existsSync(templateConfigPath)) {
        logWarning(`Template file ${chalk.white(templateConfigPath)} does not exist. check your ${chalk.white(c.paths.projectTemplateFolder)}. skipping`);
        resolve();
        return;
    }

    const templateAppConfigsFolder = path.join(c.paths.projectTemplateFolder, 'appConfigs');
    const templateAppConfigFolder = fs.readdirSync(templateAppConfigsFolder)[0];
    const templateProjectConfigFolder = path.join(c.paths.projectTemplateFolder, 'projectConfig');
    const currentTemplate = c.files.project.config.currentTemplate;
    const templateConfig = JSON.parse(fs.readFileSync(templateConfigPath).toString());

    // Check src
    logTask('configureProject:check src', chalk.grey);
    if (!fs.existsSync(c.paths.project.srcDir)) {
        logInfo(`Looks like your src folder ${chalk.white(c.paths.project.srcDir)} is missing! Let's create one for you.`);
        copyFolderContentsRecursiveSync(path.join(c.paths.projectTemplateFolder, 'src'), c.paths.project.srcDir);
    }

    // Check appConfigs
    logTask('configureProject:check appConfigs', chalk.grey);
    //
    if (!fs.existsSync(c.paths.project.appConfigsDir)) {
        logInfo(
            `Looks like your appConfig folder ${chalk.white(
                c.paths.project.appConfigsDir,
            )} is missing! Let's create sample config for you.`,
        );

        // TODO: GET CORRECT PROJECT TEMPLATE
        copyFolderContentsRecursiveSync(templateAppConfigsFolder, c.paths.project.appConfigsDir);

        const appConfigIds = listAppConfigsFoldersSync(c);

        // Update App Title to match package.json
        try {
            appConfigIds.forEach((v) => {
                const appConfigPath = path.join(c.paths.project.appConfigsDir, v, RENATIVE_CONFIG_NAME);
                const appConfig = readObjectSync(appConfigPath);
                appConfig.common = appConfig.common || {};
                if (!c.runtime.isWrapper) {
                    appConfig.common.title = c.files.project.config?.defaults?.title;
                    appConfig.common.id = c.files.project.config?.defaults?.id;
                }

                writeObjectSync(appConfigPath, appConfig);
            });

            const supPlats = c.files.project?.defaults?.supportedPlatforms;

            if (supPlats) {
                for (const pk in appConfig.platforms) {
                    if (!supPlats.includes(pk)) {
                        delete appConfig.platforms[pk];
                    }
                }
            }
        } catch (e) {
            logError(e);
        }
    }

    // Check projectConfigs
    logTask('configureProject:check projectConfigs', chalk.grey);
    if (!fs.existsSync(c.paths.project.projectConfig.dir)) {
        logInfo(
            `Looks like your projectConfig folder ${chalk.white(c.paths.project.projectConfig.dir)} is missing! Let's create one for you.`,
        );
        copyFolderContentsRecursiveSync(templateProjectConfigFolder, c.paths.project.projectConfig.dir);
    }

    // renative.json
    logTask('configureProject:check renative.json', chalk.grey);
    if (!c.runtime.isWrapper) {
        if (!c.files.project.config.currentTemplate) {
            logWarning(
                `Looks like your ${c.paths.project.config} need to be updated with ${templateConfigPath}`,
            );
            const mergedObj = mergeObjects(c, c.files.project.config, templateConfig, false, true);
            c.files.project.config.currentTemplate = currentTemplate;
            writeObjectSync(c.paths.project.config, mergedObj);
        }
    } else {
        if (templateConfig.plugins.renative) {
            templateConfig.plugins.renative = getLocalRenativePlugin();
        }
        writeObjectSync(c.paths.project.configLocal, templateConfig);
    }

    setAppConfig(c, c.runtime.appId);

    resolve();
});

export const getTemplateOptions = c => generateOptions(templates, false, null, (i, obj, mapping, defaultVal) => {
    const exists = c.buildConfig.templates?.[defaultVal];
    const installed = exists ? chalk.red(' (installed)') : '';
    return `-[${chalk.green(i + 1)}] ${chalk.green(defaultVal)}${installed} \n`;
});

export const getInstalledTemplateOptions = (c) => {
    if (c.buildConfig.templates) {
        return generateOptions(c.buildConfig.templates);
    }
    logError('You don\'t have any local templates installed');
    return [];
};
