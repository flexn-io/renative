import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { executeAsync } from '../systemTools/exec';
import { cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, removeDirs } from '../systemTools/fileutils';
import { logError, generateOptions, logWarning, logTask, setAppConfig } from '../common';
import { getMergedPlugin } from '../pluginTools';

const DEFAULT_TEMPLATES = [
    'renative-template-hello-world',
    'renative-template-blank',
    // 'renative-template-kitchen-sink'
];

const listTemplates = () => new Promise((resolve, reject) => {
    opts = generateOptions(DEFAULT_TEMPLATES);
    console.log(opts.asString);
    resolve();
});

const addTemplate = () => new Promise((resolve, reject) => {
    executeAsync('npm', ['install', 'renative-template-hello-world', '--save-dev'])
        .then(() => {
            resolve();
        })
        .catch(error => logError(error));
});

const checkIfTemplateInstalled = c => new Promise((resolve, reject) => {
    let templateName = c.files.projectConfig.defaultProjectConfigs ? c.files.projectConfig.defaultProjectConfigs.template : null;
    if (!templateName) {
        templateName = 'renative-template-hello-world';
        logWarning(`You're missing template name in your ${chalk.white(c.paths.projectConfigPath)}. ReNative will add default ${chalk.white(templateName)} for you`);
        if (c.files.projectConfig.defaultProjectConfigs) c.files.projectConfig.defaultProjectConfigs = {};
        c.files.projectConfig.defaultProjectConfigs.template = templateName;
        fs.writeFileSync(c.paths.projectConfigPath, JSON.stringify(c.files.projectConfig, null, 2));
    }

    c.paths.templateFolder = path.join(c.paths.projectNodeModulesFolder, templateName);
    if (!fs.existsSync(c.paths.templateFolder)) {
        logWarning(`Your ${chalk.white(c.paths.templateFolder)} template is not installed. ReNative will install it for you`);
        c._requiresNpmInstall = true;
    }
    resolve();
});

const applyTemplate = c => new Promise((resolve, reject) => {
    logTask(`applyTemplate:${c.files.projectConfig.defaultProjectConfigs.template}`);

    const templateFolder = path.join(c.paths.projectNodeModulesFolder, c.files.projectConfig.defaultProjectConfigs.template);
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

            appConfig.common.title = c.files.projectPackage.title;
            appConfig.common.id = c.defaultProjectConfigs.defaultAppId || c.files.projectPackage.defaultAppId;
            appConfig.id = c.defaultProjectConfigs.defaultAppConfigId || c.defaultAppConfigId;
            appConfig.platforms.ios.teamID = '';
            appConfig.platforms.tvos.teamID = '';

            const supPlats = c.defaultProjectConfigs.supportedPlatforms || c.files.projectPackage.supportedPlatforms;

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

    // Check plugins
    logTask('configureProject:check plugins');
    if (fs.existsSync(c.paths.pluginConfigPath)) {
        c.files.pluginConfig = JSON.parse(fs.readFileSync(c.paths.pluginConfigPath).toString());
    } else {
        logWarning(
            `Looks like your plugin config is missing from ${chalk.white(c.paths.pluginConfigPath)}. let's create one for you!`,
        );
        c.files.pluginConfig = { plugins: {} };
        fs.writeFileSync(c.paths.pluginConfigPath, JSON.stringify(c.files.pluginConfig, null, 2));
    }

    if (!c.files.projectPackage.dependencies) {
        c.files.projectPackage.dependencies = {};
    }

    let hasPackageChanged = false;
    for (const k in c.files.pluginConfig.plugins) {
        const dependencies = c.files.projectPackage.dependencies;
        const devDependecies = c.files.projectPackage.devDependecies;
        const plugin = getMergedPlugin(c, k, c.files.pluginConfig.plugins);

        if (dependencies && dependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && dependencies[k] !== plugin.version) {
                logWarning(
                    `Version mismatch of dependency ${chalk.white(k)} between:
${chalk.white(c.paths.projectPackagePath)}: v(${chalk.red(dependencies[k])}) and
${chalk.white(c.paths.pluginConfigPath)}: v(${chalk.red(plugin.version)}).
package.json will be overriden`
                );
                hasPackageChanged = true;
                dependencies[k] = plugin.version;
            }
        } else if (devDependecies && devDependecies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && devDependecies[k] !== plugin.version) {
                logWarning(
                    `Version mismatch of devDependency ${chalk.white(k)} between package.json: v(${chalk.red(
                        devDependecies[k],
                    )}) and plugins.json: v(${chalk.red(plugin.version)}). package.json will be overriden`,
                );
                hasPackageChanged = true;
                devDependecies[k] = plugin.version;
            }
        } else if (plugin['no-active'] !== true && plugin['no-npm'] !== true) {
            // Dependency does not exists
            logWarning(
                `Missing dependency ${chalk.white(k)} v(${chalk.red(
                    plugin.version,
                )}) in package.json. package.json will be overriden`,
            );

            hasPackageChanged = true;
            dependencies[k] = plugin.version;
        }
    }
    if (hasPackageChanged) {
        fs.writeFileSync(c.paths.projectPackagePath, JSON.stringify(c.files.projectPackage, null, 2));
        c._requiresNpmInstall = true;
    }

    // Check permissions
    logTask('configureProject:check permissions');
    if (fs.existsSync(c.paths.permissionsConfigPath)) {
        c.files.permissionsConfig = JSON.parse(fs.readFileSync(c.paths.permissionsConfigPath).toString());
    } else {
        const newPath = path.join(c.paths.rnvRootFolder, 'projectConfig/permissions.json');
        logWarning(
            `Looks like your permission config is missing from ${chalk.white(
                c.paths.permissionsConfigPath,
            )}. ReNative Default ${chalk.white(newPath)} will be used instead`,
        );
        c.paths.permissionsConfigPath = newPath;
        c.files.permissionsConfig = JSON.parse(fs.readFileSync(c.paths.permissionsConfigPath).toString());
    }

    resolve();
});


const getTemplateOptions = () => generateOptions(DEFAULT_TEMPLATES);

export { listTemplates, addTemplate, getTemplateOptions, applyTemplate, checkIfTemplateInstalled };
