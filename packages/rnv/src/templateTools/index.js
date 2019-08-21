import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import merge from 'deepmerge';
import { RENATIVE_CONFIG_NAME, RENATIVE_CONFIG_TEMPLATE_NAME } from '../constants';
import { executeAsync } from '../systemTools/exec';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, writeObjectSync, removeDirsSync, removeDirs,
    removeFilesSync, mergeObjects
} from '../systemTools/fileutils';
import { logError, logInfo, generateOptions, logWarning, logTask, configureEntryPoints } from '../common';
import { getMergedPlugin, getLocalRenativePlugin } from '../pluginTools';
import { setAppConfig } from '../configTools/configParser';

import { templates } from '../../renativeTemplates/templates.json';

const listTemplates = c => new Promise((resolve, reject) => {
    logTask('listTemplates');
    opts = generateOptions(templates);
    console.log(opts.asString);
    resolve();
});

const addTemplate = c => new Promise((resolve, reject) => {
    logTask('addTemplate');
    executeAsync('npm', ['install', 'renative-template-hello-world', '--save-dev'])
        .then(() => {
            resolve();
        })
        .catch(error => logError(error));
});

const checkIfTemplateInstalled = c => new Promise((resolve, reject) => {
    logTask('checkIfTemplateInstalled');
    if (!c.buildConfig.defaults) {
        logWarning(`Your ${chalk.white(c.paths.project.config)} does not contain ${chalk.white('defaultProjectConfigs')} object. ReNative will skip template generation`);
        resolve();
        return;
    }

    let templateName = c.buildConfig.defaults.template;
    if (!templateName) {
        templateName = 'renative-template-hello-world';
        logWarning(`You're missing template name in your ${chalk.white(c.paths.project.config)}. ReNative will add default ${chalk.white(templateName)} for you`);
        c.buildConfig.defaults.template = templateName;
        fs.writeFileSync(c.paths.project.config, JSON.stringify(c.files.project.config, null, 2));
    }

    c.paths.templateFolder = path.join(c.paths.project.nodeModulesDir, templateName);
    if (!fs.existsSync(c.paths.templateFolder)) {
        logWarning(`Your ${chalk.white(c.paths.templateFolder)} template is not installed. ReNative will install it for you`);

        if (c.files.project.package.devDependencies) {
            if (!c.files.project.package.devDependencies[templateName]) {
                c.files.project.package.devDependencies[templateName] = 'latest';
                writeObjectSync(c.paths.project.package, c.files.project.package);
            }
        }

        c._requiresNpmInstall = true;
    }
    resolve();
});

const _applyLocalRenative = c => new Promise((resolve, reject) => {
    logTask(`_applyLocalRenative:${c.runtime.isWrapper}`);
    if (!c.runtime.isWrapper) {
        resolve();
        return;
    }

    if (c.files.project.config.plugins.renative) {
        c.files.project.config.plugins.renative = getLocalRenativePlugin();
    }
    writeObjectSync(c.paths.project.config, c.files.project.config);
    resolve();
});


const applyLocalTemplate = (c, selectedTemplate) => new Promise((resolve, reject) => {
    logTask(`applyLocalTemplate:${selectedTemplate}`);
    const currentTemplate = c.buildConfig.defaults.template;
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
            .then(() => _applyLocalRenative(c))
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const applyTemplate = c => new Promise((resolve, reject) => {
    logTask('applyTemplate');
    const currentTemplate = c.buildConfig.defaults.template;

    if (!c.buildConfig.defaults) {
        reject(`Your ${RENATIVE_CONFIG_NAME} is missing defaultProjectConfigs object`);
        return;
    }

    c.paths.projectTemplateFolder = path.join(c.paths.project.nodeModulesDir, c.buildConfig.defaults.template);

    _applyTemplate(c)
        // .then(() => configureEntryPoints(c)) // NOT READY YET
        // .then(() => _applyLocalRenative(c)) //NOT READY YET
        .then(() => resolve())
        .catch(e => reject(e));
});

const _applyTemplate = c => new Promise((resolve, reject) => {
    logTask(`_applyTemplate:${c.paths.projectTemplateFolder}`);


    if (!fs.existsSync(c.paths.projectTemplateFolder)) {
        logWarning(`Template ${chalk.white(c.buildConfig.defaults.template)} does not exist in your ${chalk.white(c.paths.projectTemplateFolder)}. skipping`);
        resolve();
        return;
    }

    const templateAppConfigsFolder = path.join(c.paths.projectTemplateFolder, 'appConfigs');
    const templateAppConfigFolder = fs.readdirSync(templateAppConfigsFolder)[0];
    const templateProjectConfigFolder = path.join(c.paths.projectTemplateFolder, 'projectConfig');
    const templateConfigPath = path.join(c.paths.projectTemplateFolder, RENATIVE_CONFIG_TEMPLATE_NAME);
    const currentTemplate = c.files.project.config.defaults.template;
    const templateConfig = JSON.parse(fs.readFileSync(templateConfigPath).toString());

    if (templateAppConfigFolder) c.defaultAppConfigId = templateAppConfigFolder;

    // Check src
    logTask('configureProject:check src', chalk.grey);
    if (!fs.existsSync(c.paths.project.srcDir)) {
        logInfo(`Looks like your src folder ${chalk.white(c.paths.project.srcDir)} is missing! Let's create one for you.`);
        copyFolderContentsRecursiveSync(path.join(c.paths.projectTemplateFolder, 'src'), c.paths.project.srcDir);
    }

    // Check appConfigs
    logTask('configureProject:check appConfigs', chalk.grey);
    setAppConfig(c, c.defaultAppConfigId);
    if (!fs.existsSync(c.paths.project.appConfigsDir)) {
        logInfo(
            `Looks like your appConfig folder ${chalk.white(
                c.paths.project.appConfigsDir,
            )} is missing! Let's create sample config for you.`,
        );


        // TODO: GET CORRECT PROJECT TEMPLATE
        copyFolderContentsRecursiveSync(templateAppConfigsFolder, c.paths.project.appConfigsDir);


        // Update App Title to match package.json
        try {
            const appConfig = JSON.parse(fs.readFileSync(c.paths.appConfig.config).toString());

            appConfig.common.title = c.buildConfig.defaults.defaultTitle || c.files.project.package.title;
            appConfig.common.id = c.buildConfig.defaults.defaultAppId || c.files.project.package.defaultAppId;
            appConfig.id = c.buildConfig.defaults.defaultAppConfigId || c.defaultAppConfigId;
            appConfig.platforms.ios.teamID = '';
            appConfig.platforms.tvos.teamID = '';

            const supPlats = c.buildConfig.defaults.supportedPlatforms;

            if (supPlats) {
                for (const pk in appConfig.platforms) {
                    if (!supPlats.includes(pk)) {
                        delete appConfig.platforms[pk];
                    }
                }
            }

            fs.writeFileSync(c.paths.appConfig.config, JSON.stringify(appConfig, null, 2));
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
    if (!c.files.project.config.template) {
        logWarning(
            `Looks like your ${c.paths.project.config} need to be updated with ${templateConfigPath}`,
        );
        c.files.project.config = mergeObjects(c, c.files.project.config, templateConfig, false, true);
        c.files.project.config.currentTemplate = currentTemplate;
        writeObjectSync(c.paths.project.config, c.files.project.config);
    }

    resolve();
});

const getTemplateOptions = () => generateOptions(templates);

export {
    listTemplates, addTemplate, getTemplateOptions, applyTemplate,
    applyLocalTemplate, checkIfTemplateInstalled
};
