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
import { executePipe } from './buildHooks';
import { printIntoBox, printBoxStart, printBoxEnd, printArrIntoBox } from '../systemTools/logger';
import { copyRuntimeAssets, copySharedPlatforms } from './projectParser';
import { getWorkspaceOptions } from './workspace';
import { generateRuntimeConfig, loadProjectTemplates, parseRenativeConfigs } from '../configTools/configParser';

const highlight = chalk.green;

export const createNewProject = async (c) => {
    logTask('createNewProject');
    const { args } = c.program;

    let data = {
        defaultVersion: '0.1.0',
        defaultTemplate: 'renative-template-hello-world',
        defaultProjectName: 'helloRenative',
        defaultAppTitle: 'Hello Renative',
        defaultWorkspace: 'rnv'
    };
    data.optionPlatforms = generateOptions(SUPPORTED_PLATFORMS, true);
    data.optionTemplates = {};
    data.optionWorkspaces = getWorkspaceOptions(c);

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
        inputAppTitle, inputAppID, inputVersion, inputWorkspace
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
        name: 'inputWorkspace',
        type: 'list',
        message: 'What workspace to use?',
        default: data.defaultWorkspace,
        choices: data.optionWorkspaces.keysAsArray
    }]);

    c.runtime.selectedWorkspace = inputWorkspace;
    parseRenativeConfigs(c);
    data.optionTemplates = getTemplateOptions(c);

    const {
        inputTemplate, inputSupportedPlatforms
    } = await inquirer.prompt([{
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
        ...data, inputProjectName, inputAppTitle, inputAppID, inputVersion, inputTemplate, inputSupportedPlatforms, inputWorkspace
    };

    data.optionTemplates.selectedOption = inputTemplate;
    data.optionPlatforms.selectedOptions = inputSupportedPlatforms;
    data.optionWorkspaces.selectedOption = inputWorkspace;
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
            workspaceID: data.optionWorkspaces.selectedOption,
            paths: {
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
    str += printIntoBox(`Workspace: ${highlight(data.optionWorkspaces.selectedOption)}`, 1);
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
