/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
import {
    logTask,
    logSuccess,
    getAppFolder,
    isPlatformActive,
    logWarning,
    logInfo,
    spawnCommand
} from '../common';
import { generateOptions } from '../systemTools/prompt';
import {
    IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    MACOS,
    WINDOWS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    RENATIVE_CONFIG_NAME,
    SUPPORTED_PLATFORMS
} from '../constants';
import { configureXcodeProject } from '../platformTools/apple';
import { configureGradleProject } from '../platformTools/android';
import { configureTizenProject, configureTizenGlobal } from '../platformTools/tizen';
import { configureWebOSProject } from '../platformTools/webos';
import { configureElectronProject } from '../platformTools/electron';
import { configureKaiOSProject } from '../platformTools/firefox';
import { configureWebProject } from '../platformTools/web';
import { getTemplateOptions } from '../templateTools';
import { copyFolderContentsRecursiveSync, mkdirSync, writeObjectSync } from '../systemTools/fileutils';
import { executeAsync } from '../systemTools/exec';
import platformRunner from './platform';
import { executePipe } from '../projectTools/buildHooks';
import { printIntoBox, printBoxStart, printBoxEnd, printArrIntoBox } from '../systemTools/logger';
import { copyRuntimeAssets, copySharedPlatforms } from '../projectTools/projectParser';
import { generateRuntimeConfig } from '../configTools/configParser';

const CONFIGURE = 'configure';
const SWITCH = 'switch';
const CREATE = 'create';
const NEW = 'new';

const PIPES = {
    APP_CONFIGURE_BEFORE: 'configure:before',
    APP_CONFIGURE_AFTER: 'configure:after',
    APP_SWITCH_BEFORE: 'switch:before',
    APP_SWITCH_AFTER: 'switch:after',
};

const highlight = chalk.green;

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.command) {
    case NEW:
        return _runCreate(c);
    case CONFIGURE:
        return _runConfigure(c);
    case SWITCH:
        return _runSwitch(c);
    }

    switch (c.subCommand) {
    case CONFIGURE:
        logWarning(`$ ${chalk.red('$ rnv app configure')} is deprecated. Use ${chalk.green('$ rnv configure')} instead`);
        return _runConfigure(c);

        // case SWITCH:
        //     return Promise.resolve();
        //     break;
        //
        // case REMOVE:
        //     return Promise.resolve();
        //     break;
        // case LIST:
        //     return Promise.resolve();
        //     break;
        // case INFO:
        //     return Promise.resolve();
        //     break;
    default:
        return Promise.reject(`cli:app: Sub-Command ${c.subCommand} not supported`);
    }
};

// ##########################################
//  PRIVATE
// ##########################################

const _runConfigure = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`_runConfigure:${p}`);

    executePipe(c, PIPES.APP_CONFIGURE_BEFORE)
        .then(() => _checkAndCreatePlatforms(c, c.program.platform))
        .then(() => copyRuntimeAssets(c))
        .then(() => copySharedPlatforms(c))
        .then(() => generateRuntimeConfig(c))
        .then(() => _runPlugins(c, c.paths.rnv.plugins.dir))
        .then(() => _runPlugins(c, c.paths.project.projectConfig.pluginsDir))
        .then(() => (_isOK(c, p, [ANDROID]) ? configureGradleProject(c, ANDROID) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_TV]) ? configureGradleProject(c, ANDROID_TV) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_WEAR]) ? configureGradleProject(c, ANDROID_WEAR) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN]) ? configureTizenGlobal(c, TIZEN) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN]) ? configureTizenProject(c, TIZEN) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN_WATCH]) ? configureTizenProject(c, TIZEN_WATCH) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN_MOBILE]) ? configureTizenProject(c, TIZEN_MOBILE) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WEBOS]) ? configureWebOSProject(c, WEBOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WEB]) ? configureWebProject(c, WEB) : Promise.resolve()))
        .then(() => (_isOK(c, p, [MACOS]) ? configureElectronProject(c, MACOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WINDOWS]) ? configureElectronProject(c, WINDOWS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [KAIOS]) ? configureKaiOSProject(c, KAIOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [FIREFOX_OS]) ? configureKaiOSProject(c, FIREFOX_OS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [FIREFOX_TV]) ? configureKaiOSProject(c, FIREFOX_TV) : Promise.resolve()))
        .then(() => (_isOK(c, p, [IOS]) ? configureXcodeProject(c, IOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TVOS]) ? configureXcodeProject(c, TVOS) : Promise.resolve()))
        .then(() => executePipe(c, PIPES.APP_CONFIGURE_AFTER))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runSwitch = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`_runSwitch:${p}`);

    executePipe(c, PIPES.APP_SWITCH_AFTER)

        .then(() => copyRuntimeAssets(c))
        .then(() => copySharedPlatforms(c))
        .then(() => generateRuntimeConfig(c))
        .then(() => executePipe(c, PIPES.APP_SWITCH_AFTER))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _isOK = (c, p, list) => {
    let result = false;
    list.forEach((v) => {
        if (isPlatformActive(c, v) && (p === v || p === 'all')) result = true;
    });
    return result;
};

const _runCreate = async (c) => {
    logTask('_runCreate');
    const { args } = c.program;

    let data = {
        defaultVersion: '0.1.0',
        defaultTemplate: 'renative-template-hello-world',
        defaultProjectName: 'helloRenative',
        defaultAppTitle: 'Hello Renative'
    };
    data.optionPlatforms = generateOptions(SUPPORTED_PLATFORMS, true);
    data.optionTemplates = getTemplateOptions(c);

    // logWelcome();
    let inputProjectName;

    if (args[1] && args[1] !== '') {
        inputProjectName = args[1];
    } else {
        const inputProjectNameObj = await inquirer.prompt({
            name: 'inputProjectName',
            type: 'input',
            validate: value => !!value,
            message: "What's your project Name? (no spaces, folder based on ID will be created in this directory)"
        });
        inputProjectName = inputProjectNameObj.inputProjectName;
    }

    const {
        inputAppTitle, inputAppID, inputVersion, inputTemplate, inputSupportedPlatforms
    } = await inquirer.prompt([{
        name: 'inputAppTitle',
        type: 'input',
        default: data.defaultAppTitle,
        validate: val => !!val || 'Please enter a title',
        message: 'What\'s your project Title?'
    }, {
        name: 'inputAppID',
        type: 'input',
        default: () => {
            data.appID = `com.mycompany.${inputProjectName.replace(/\s+/g, '').toLowerCase()}`;
            return data.appID;
        },
        validate: id => !!id.match(/[a-z]+\.[a-z0-9]+\.[a-z0-9]+/) || 'Please enter a valid appID (com.test.app)',
        message: 'What\'s your App ID?'
    }, {
        name: 'inputVersion',
        type: 'input',
        default: data.defaultVersion,
        validate: v => !!semver.valid(semver.coerce(v)) || 'Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.)',
        message: 'What\'s your Version?'
    }, {
        name: 'inputTemplate',
        type: 'list',
        message: 'What template to use?',
        default: data.defaultTemplate,
        choices: data.optionTemplates.keysAsArray
    }, {
        name: 'inputSupportedPlatforms',
        type: 'checkbox',
        pageSize: 20,
        message: 'What platforms would you like to use?',
        validate: val => !!val.length || 'Please select at least a platform',
        default: data.optionPlatforms.keysAsArray,
        choices: data.optionPlatforms.keysAsArray
    }]);


    data = {
        ...data, inputProjectName, inputAppTitle, inputAppID, inputVersion, inputTemplate, inputSupportedPlatforms
    };

    data.optionTemplates.selectedOption = inputTemplate;
    data.optionPlatforms.selectedOptions = inputSupportedPlatforms;
    _prepareProjectOverview(c, data);

    const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `\n${data.confirmString}\nIs all this correct?`
    });

    if (confirm) {
        await _generateProject(c, data);
    }
};

const _generateProject = (c, data) => {
    logTask('_generateProject');

    const base = path.resolve('.');

    c.paths.project.dir = path.join(base, data.projectName.replace(/(\s+)/g, '_'));
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.config = path.join(c.paths.project.dir, RENATIVE_CONFIG_NAME);

    data.packageName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

    mkdirSync(c.paths.project.dir);

    const templates = {};


    return executeAsync(c, `npm show ${data.optionTemplates.selectedOption} version`).then((v) => {
        logTask(`_generateProject:${data.optionTemplates.selectedOption}:${v}`, chalk.grey);

        templates[data.optionTemplates.selectedOption] = {
            version: v
        };

        const config = {
            projectName: data.projectName,
            paths: {
                globalConfigDir: '~/.rnv',
                appConfigsDir: './appConfigs',
                platformTemplatesDir: 'RNV_HOME/platformTemplates',
                entryDir: './',
                platformAssetsDir: './platformAssets',
                platformBuildsDir: './platformBuilds',
                projectConfigDir: './projectConfig'
            },
            defaults: {
                title: data.appTitle,
                id: data.appID,
                supportedPlatforms: data.optionPlatforms.selectedOptions
            },
            templates,
            currentTemplate: data.optionTemplates.selectedOption,
            isNew: true
        };

        writeObjectSync(c.paths.project.config, config);

        logSuccess(
            `Your project is ready! navigate to project ${chalk.white(`cd ${data.projectName}`)} and run ${chalk.white(
                'rnv run -p web',
            )} to see magic happen!`,
        );
    });
};

const _prepareProjectOverview = (c, data) => {
    data.projectName = data.inputProjectName;
    data.appTitle = data.inputAppTitle || data.defaultAppTitle;
    data.teamID = '';
    data.appID = data.inputAppID ? data.inputAppID.replace(/\s+/g, '-').toLowerCase() : data.appID;
    data.version = data.inputVersion || data.defaultVersion;

    let str = printBoxStart('🚀  ReNative Project Generator');
    str += printIntoBox('');
    str += printIntoBox(`Project Name (folder): ${highlight(data.projectName)}`, 1);
    str += printIntoBox(`Project Title: ${highlight(data.appTitle)}`, 1);
    str += printIntoBox(`Project Version: ${highlight(data.version)}`, 1);
    str += printIntoBox(`App ID: ${highlight(data.appID)}`, 1);
    str += printIntoBox(`Project Template: ${highlight(data.optionTemplates.selectedOption)}`, 1);
    str += printIntoBox('');
    str += printIntoBox('Project Platforms:');
    str += printArrIntoBox(data.optionPlatforms.selectedOptions);
    str += printIntoBox('');
    str += printIntoBox('Project Structure:');
    str += printIntoBox('');
    str += printIntoBox(data.projectName);
    str += chalk.gray(`│   ├── appConfigs            # Application flavour configuration files/assets │
│   │   └── [APP_ID]          # Example application flavour                    │
│   │       ├── assets        # Platform assets injected to ./platformAssets   │
│   │       ├── builds        # Platform files injected to ./platformBuilds    │
│   │       └── renative.json # Application flavour config                     │
│   ├── platformAssets        # Generated cross-platform assets                │
│   ├── platformBuilds        # Generated platform app projects                │
│   ├── projectConfigs        # Project configuration files/assets             │
│   │   ├── fonts             # Folder for all custom fonts                    │
│   │   ├── builds            # platformBuilds/* injections                    │
│   │   └── plugins           # Multi-platform plugins injections              │
│   ├── src                   # Source code files                              │
│   ├── index.*.js            # Entry files                                    │
│   └── renative.json         # ReNative project configuration                 │
`);
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    data.confirmString = str;
};

const _checkAndCreatePlatforms = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_checkAndCreatePlatforms:${platform}`);

    if (!fs.existsSync(c.paths.project.builds.dir)) {
        logWarning('Platforms not created yet. creating them for you...');
        platformRunner(spawnCommand(c, {
            subCommand: 'configure',
            program: { appConfig: c.runtime.appId, platform }
        }))
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    if (platform) {
        const appFolder = getAppFolder(c, platform);
        if (!fs.existsSync(appFolder)) {
            logWarning(`Platform ${platform} not created yet. creating them for you...`);
            platformRunner(spawnCommand(c, {
                subCommand: 'configure',
                program: { appConfig: c.runtime.appId, platform }
            }))
                .then(() => resolve())
                .catch(e => reject(e));

            return;
        }
    } else {
        const { platforms } = c.buildConfig;
        const cmds = [];
        if (!platforms) {
            reject(`Your ${chalk.white(c.paths.appConfig.config)} is missconfigured. (Maybe you have older version?). Missing ${chalk.white('{ platforms: {} }')} object at root`);
            return;
        }

        Object.keys(platforms).forEach((k) => {
            if (!fs.existsSync(k)) {
                logWarning(`Platform ${k} not created yet. creating one for you...`);
                cmds.push(platformRunner(spawnCommand(c, {
                    subCommand: 'configure',
                    program: { appConfig: c.runtime.appId, platform }
                })));
            }
        });

        Promise.all(cmds)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    resolve();
});

const _runPlugins = (c, pluginsPath) => new Promise((resolve) => {
    logTask(`_runPlugins:${pluginsPath}`, chalk.grey);

    if (!fs.existsSync(pluginsPath)) {
        logInfo(`Your project plugin folder ${chalk.white(pluginsPath)} does not exists. skipping plugin configuration`);
        resolve();
        return;
    }

    fs.readdirSync(pluginsPath).forEach((dir) => {
        const source = path.resolve(pluginsPath, dir, 'overrides');
        const dest = path.resolve(c.paths.project.dir, 'node_modules', dir);

        if (fs.existsSync(source)) {
            copyFolderContentsRecursiveSync(source, dest, false);
            // fs.readdirSync(pp).forEach((dir) => {
            //     copyFileSync(path.resolve(pp, file), path.resolve(c.paths.project.dir, 'node_modules', dir));
            // });
        } else {
            logInfo(`Your plugin configuration has no override path ${chalk.white(source)}. skipping override action`);
        }
    });

    resolve();
});

export { PIPES };

export default run;
