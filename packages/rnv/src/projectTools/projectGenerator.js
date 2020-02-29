/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
import fs from 'fs';
import { generateOptions } from '../systemTools/prompt';
import {
    RENATIVE_CONFIG_NAME,
    SUPPORTED_PLATFORMS
} from '../constants';
import { getTemplateOptions } from '../templateTools';
import { mkdirSync, writeFileSync } from '../systemTools/fileutils';
import { executeAsync, commandExistsSync } from '../systemTools/exec';
import { printIntoBox, printBoxStart, printBoxEnd, printArrIntoBox,
    logTask,
    logSuccess,
    logInfo,
    logWarning } from '../systemTools/logger';
import { getWorkspaceOptions } from './workspace';
import { parseRenativeConfigs } from '../configTools/configParser';
import Analytics from '../systemTools/analytics';

const highlight = chalk.green;

const configureGit = async (c) => {
    const projectPath = c.paths.project.dir;
    logTask(`configureGit:${projectPath}`);

    if (!fs.existsSync(path.join(projectPath, '.git'))) {
        logInfo('Your project does not have a git repo. Creating one...');
        if (commandExistsSync('git')) {
            await executeAsync('git init', { cwd: projectPath });
            await executeAsync('git add -A', { cwd: projectPath });
            await executeAsync('git commit -m "Initial"', { cwd: projectPath });
        } else {
            logWarning('We tried to create a git repo inside your project but you don\'t seem to have git installed');
        }
    }
};

const _generateProject = async (c, data) => {
    logTask('_generateProject');

    const base = path.resolve('.');

    c.paths.project.dir = path.join(base, data.projectName.replace(/(\s+)/g, '_'));
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.config = path.join(c.paths.project.dir, RENATIVE_CONFIG_NAME);

    data.packageName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

    mkdirSync(c.paths.project.dir);

    const templates = {};


    logTask(`_generateProject:${data.optionTemplates.selectedOption}:${data.optionTemplates.selectedVersion}`, chalk.grey);

    templates[data.optionTemplates.selectedOption] = {
        version: data.optionTemplates.selectedVersion
    };

    const config = {
        projectName: data.projectName,
        workspaceID: data.optionWorkspaces.selectedOption,
        paths: {
            appConfigsDir: './appConfigs',
            platformTemplatesDir: '$RNV_HOME/platformTemplates',
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

    writeFileSync(c.paths.project.config, config);

    if (data.gitEnabled) {
        await configureGit(c);
    }

    logSuccess(
        `Your project is ready! navigate to project ${chalk.white(`cd ${data.projectName}`)} and run ${chalk.white(
            `rnv run -p ${data.optionPlatforms.selectedOptions[0]}`,
        )} to see magic happen!`,
    );
};

const _prepareProjectOverview = (c, data) => {
    data.projectName = data.inputProjectName;
    data.appTitle = data.inputAppTitle || data.defaultAppTitle;
    data.teamID = '';
    data.appID = data.inputAppID ? data.inputAppID.replace(/\s+/g, '-').toLowerCase() : data.appID;
    data.version = data.inputVersion || data.defaultVersion;
    const tempString = `${data.optionTemplates.selectedOption}@${data.optionTemplates.selectedVersion}`;

    let str = printBoxStart('🚀  ReNative Project Generator');
    str += printIntoBox('');
    str += printIntoBox(`Project Name (folder): ${highlight(data.projectName)}`, 1);
    str += printIntoBox(`Workspace: ${highlight(data.optionWorkspaces.selectedOption)}`, 1);
    str += printIntoBox(`Project Title: ${highlight(data.appTitle)}`, 1);
    str += printIntoBox(`Project Version: ${highlight(data.version)}`, 1);
    str += printIntoBox(`App ID: ${highlight(data.appID)}`, 1);
    str += printIntoBox(`Project Template: ${highlight(tempString)}`, 1);
    str += printIntoBox(`Git Enabled: ${highlight(data.gitEnabled)}`, 1);
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
│   │       ├── fonts             # Folder for all custom fonts                │
│   │       ├── plugins           # Multi-platform plugins injections          │
│   │       └── renative.json # Application flavour config                     │
│   ├── platformAssets        # Generated cross-platform assets                │
│   ├── platformBuilds        # Generated platform app projects                │
│   ├── src                   # Source code files                              │
│   ├── index.*.js            # Entry files                                    │
│   └── renative.json         # ReNative project configuration                 │
`);
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    data.confirmString = str;
};

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
    data.optionWorkspaces.selectedOption = inputWorkspace;

    c.runtime.selectedWorkspace = inputWorkspace;
    await parseRenativeConfigs(c);
    data.optionTemplates = getTemplateOptions(c);

    const {
        inputTemplate
    } = await inquirer.prompt({
        name: 'inputTemplate',
        type: 'list',
        message: 'What template to use?',
        default: data.defaultTemplate,
        choices: data.optionTemplates.keysAsArray
    });
    data.optionTemplates.selectedOption = inputTemplate;

    const templateVersionsStr = await executeAsync(c, `npm view ${data.optionTemplates.selectedOption} versions`);
    const versionArr = templateVersionsStr.replace(/\r?\n|\r|\s|'|\[|\]/g, '').split(',').reverse();
    const { rnvVersion } = c;

    // filter greater versions than rnv
    const validVersions = versionArr.filter(version => semver.lte(version, rnvVersion)).map(v => ({ name: v, value: v }));
    if (validVersions[0].name === rnvVersion) {
        // mark the same versions as recommended
        validVersions[0].name = `${validVersions[0].name} (recommended)`;
    }

    data.optionTemplates.selectedVersion = versionArr[0];

    const {
        inputTemplateVersion
    } = await inquirer.prompt({
        name: 'inputTemplateVersion',
        type: 'list',
        message: 'What version of template to use?',
        default: data.optionTemplates.selectedVersion,
        choices: validVersions
    });
    data.optionTemplates.selectedVersion = inputTemplateVersion;


    const {
        inputSupportedPlatforms
    } = await inquirer.prompt({
        name: 'inputSupportedPlatforms',
        type: 'checkbox',
        pageSize: 20,
        message: 'What platforms would you like to use?',
        validate: val => !!val.length || 'Please select at least a platform',
        default: data.optionPlatforms.keysAsArray,
        choices: data.optionPlatforms.keysAsArray
    });

    const {
        gitEnabled
    } = await inquirer.prompt({
        name: 'gitEnabled',
        type: 'confirm',
        message: 'Do you want to set-up git in your new project?'
    });

    data = {
        ...data, inputProjectName, inputAppTitle, inputAppID, inputVersion, inputTemplate, inputSupportedPlatforms, inputWorkspace, gitEnabled
    };
    data.optionPlatforms.selectedOptions = inputSupportedPlatforms;


    _prepareProjectOverview(c, data);

    const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `\n${data.confirmString}\nIs all this correct?`
    });

    if (confirm) {
        try {
            await Analytics.captureEvent({
                type: 'newProject',
                template: inputTemplate,
                platforms: inputSupportedPlatforms
            });
        } catch {}

        await _generateProject(c, data);
    }
};
