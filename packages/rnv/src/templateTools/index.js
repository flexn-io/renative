import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { executeAsync } from '../systemTools/exec';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, removeFiles
} from '../systemTools/fileutils';
import { logError, generateOptions, logWarning, logTask, setAppConfig, configureEntryPoints } from '../common';
import { getMergedPlugin, getLocalRenativePlugin } from '../pluginTools';

const DEFAULT_TEMPLATES = [
    'renative-template-hello-world',
    'renative-template-blank',
    // 'renative-template-kitchen-sink'
];

const listTemplates = c => new Promise((resolve, reject) => {
    logTask('listTemplates');
    opts = generateOptions(DEFAULT_TEMPLATES);
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
    if (!c.files.projectConfig.defaultProjectConfigs) {
        logWarning(`Your ${chalk.white(c.paths.projectConfigPath)} does not contain ${chalk.white('defaultProjectConfigs')} object. ReNative will skip template generation`);
        resolve();
        return;
    }

    let templateName = c.files.projectConfig.defaultProjectConfigs.template;
    if (!templateName) {
        templateName = 'renative-template-hello-world';
        logWarning(`You're missing template name in your ${chalk.white(c.paths.projectConfigPath)}. ReNative will add default ${chalk.white(templateName)} for you`);
        c.files.projectConfig.defaultProjectConfigs.template = templateName;
        fs.writeFileSync(c.paths.projectConfigPath, JSON.stringify(c.files.projectConfig, null, 2));
    }

    c.paths.templateFolder = path.join(c.paths.projectNodeModulesFolder, templateName);
    if (!fs.existsSync(c.paths.templateFolder)) {
        logWarning(`Your ${chalk.white(c.paths.templateFolder)} template is not installed. ReNative will install it for you`);

        if (c.files.projectPackage.devDependencies) {
            if (!c.files.projectPackage.devDependencies[templateName]) {
                c.files.projectPackage.devDependencies[templateName] = 'latest';
                writeObjectSync(c.paths.projectPackagePath, c.files.projectPackage);
            }
        }

        c._requiresNpmInstall = true;
    }
    resolve();
});

const _applyLocalRenative = c => new Promise((resolve, reject) => {
    if (!c.isWrapper) {
        resolve();
        return;
    }

    if (c.files.pluginConfig.plugins.renative) {
        c.files.pluginConfig.plugins.renative = getLocalRenativePlugin();
    }
    writeObjectSync(c.paths.pluginConfigPath, c.files.pluginConfig);
    resolve();
});


const applyLocalTemplate = (c, selectedTemplate) => new Promise((resolve, reject) => {
    logTask(`applyLocalTemplate:${selectedTemplate}`);
    const currentTemplate = c.files.projectConfig.defaultProjectConfigs.template;
    if (selectedTemplate) {
        logTask(`applyTemplate:${selectedTemplate}`);
        // LOCAL TEMPLATE
        if (currentTemplate !== selectedTemplate) {
            logWarning(`Current template ${chalk.red(currentTemplate)} will be overriden by ${chalk.green(selectedTemplate)}`);
        }

        // removeDirs();
        const dirsToRemove = [
            path.join(c.paths.projectConfigFolder),
            path.join(c.paths.projectSourceFolder),
            path.join(c.paths.appConfigsFolder)
        ];

        const filesToRemove = c.files.projectConfig.defaultProjectConfigs.supportedPlatforms.map(p => path.join(c.paths.projectRootFolder, `index.${p}.js`));

        removeDirs(dirsToRemove);
        // TODO: NOT SERVED FROM TEMPLATE YET
        removeFiles(filesToRemove);

        const templateFolder = path.join(c.paths.projectNodeModulesFolder, selectedTemplate);

        _applyTemplate(c, templateFolder)
            .then(() => configureEntryPoints(c))
            .then(() => _applyLocalRenative(c))
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const applyTemplate = c => new Promise((resolve, reject) => {
    logTask('applyTemplate');
    const currentTemplate = c.files.projectConfig.defaultProjectConfigs.template;

    if (!c.files.projectConfig.defaultProjectConfigs) {
        reject('Your rnv-config.json is missing defaultProjectConfigs object');
        return;
    }

    const templateFolder = path.join(c.paths.projectNodeModulesFolder, c.files.projectConfig.defaultProjectConfigs.template);


    _applyTemplate(c, templateFolder)
        // .then(() => configureEntryPoints(c)) //NOT READY YET
        // .then(() => _applyLocalRenative(c)) //NOT READY YET
        .then(() => resolve())
        .catch(e => reject(e));
});

const _applyTemplate = (c, templateFolder) => new Promise((resolve, reject) => {
    logTask(`_applyTemplate:${c.files.projectConfig.defaultProjectConfigs.template}`);


    if (!fs.existsSync(templateFolder)) {
        logWarning(`Template ${chalk.white(c.files.projectConfig.defaultProjectConfigs.template)} does not exist in your ${chalk.white(templateFolder)}. skipping`);
        resolve();
        return;
    }

    const templateAppConfigsFolder = path.join(templateFolder, 'appConfigs');
    const templateAppConfigFolder = fs.readdirSync(templateAppConfigsFolder)[0];
    const templateProjectConfigFolder = path.join(templateFolder, 'projectConfig');

    if (templateAppConfigFolder) c.defaultAppConfigId = templateAppConfigFolder;

    // Check src
    logTask('configureProject:check src');
    if (!fs.existsSync(c.paths.projectSourceFolder)) {
        logWarning(`Looks like your src folder ${chalk.white(c.paths.projectSourceFolder)} is missing! Let's create one for you.`);
        copyFolderContentsRecursiveSync(path.join(templateFolder, 'src'), c.paths.projectSourceFolder);
    }

    // Check appConfigs
    logTask('configureProject:check appConfigs');
    setAppConfig(c, path.join(c.paths.appConfigsFolder, c.defaultAppConfigId));
    if (!fs.existsSync(c.paths.appConfigsFolder)) {
        logWarning(
            `Looks like your appConfig folder ${chalk.white(
                c.paths.appConfigsFolder,
            )} is missing! Let's create sample config for you.`,
        );


        // TODO: GET CORRECT PROJECT TEMPLATE
        copyFolderContentsRecursiveSync(templateAppConfigsFolder, c.paths.appConfigsFolder);


        // Update App Title to match package.json
        try {
            const appConfig = JSON.parse(fs.readFileSync(c.paths.appConfigPath).toString());

            appConfig.common.title = c.files.projectConfig.defaultProjectConfigs.defaultTitle || c.files.projectPackage.title;
            appConfig.common.id = c.files.projectConfig.defaultProjectConfigs.defaultAppId || c.files.projectPackage.defaultAppId;
            appConfig.id = c.files.projectConfig.defaultProjectConfigs.defaultAppConfigId || c.defaultAppConfigId;
            appConfig.platforms.ios.teamID = '';
            appConfig.platforms.tvos.teamID = '';

            const supPlats = c.files.projectConfig.defaultProjectConfigs.supportedPlatforms;

            if (supPlats) {
                for (const pk in appConfig.platforms) {
                    if (!supPlats.includes(pk)) {
                        delete appConfig.platforms[pk];
                    }
                }
            }

            fs.writeFileSync(c.paths.appConfigPath, JSON.stringify(appConfig, null, 2));
        } catch (e) {
            logError(e);
        }
    }

    // Check projectConfigs
    logTask('configureProject:check projectConfigs');
    if (!fs.existsSync(c.paths.projectConfigFolder)) {
        logWarning(
            `Looks like your projectConfig folder ${chalk.white(c.paths.projectConfigFolder)} is missing! Let's create one for you.`,
        );
        copyFolderContentsRecursiveSync(templateProjectConfigFolder, c.paths.projectConfigFolder);
    }

    resolve();
});

const getTemplateOptions = () => generateOptions(DEFAULT_TEMPLATES);

export {
    listTemplates, addTemplate, getTemplateOptions, applyTemplate,
    applyLocalTemplate, checkIfTemplateInstalled
};
