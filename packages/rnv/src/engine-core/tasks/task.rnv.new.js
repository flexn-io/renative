import inquirer from 'inquirer';
import lSet from 'lodash.set';
import path from 'path';
import semver from 'semver';
import {
    CURRENT_DIR,
    PARAMS,
    RENATIVE_CONFIG_NAME
} from '../../core/constants';
import { checkAndCreateGitignore } from '../../core/projectManager';
import { getWorkspaceOptions } from '../../core/projectManager/workspace';
import { updateRenativeConfigs } from '../../core/runtimeManager';
import Analytics from '../../core/systemManager/analytics';
import { executeAsync } from '../../core/systemManager/exec';
import {
    cleanFolder,
    fsExistsSync,
    mkdirSync,
    readObjectSync,
    removeDirs,
    writeFileSync,
    writeObjectSync
} from '../../core/systemManager/fileutils';
import { configureGit } from '../../core/systemManager/gitUtils';
import {
    chalk,
    logDebug,
    logInfo,
    logSuccess,
    logTask,
    logWarning,
    printArrIntoBox,
    printBoxEnd,
    printBoxStart,
    printIntoBox
} from '../../core/systemManager/logger';
import { listAndSelectNpmVersion } from '../../core/systemManager/npmUtils';
import { getTemplateOptions } from '../../core/templateManager';

const highlight = chalk().green;

const _prepareProjectOverview = (c, data) => {
    data.appTitle = data.inputAppTitle || data.defaultAppTitle;
    data.teamID = '';
    data.appID = data.inputAppID
        ? data.inputAppID.replace(/\s+/g, '-').toLowerCase()
        : data.appID;
    data.version = data.inputVersion || data.defaultVersion;
    const tempString = `${data.optionTemplates.selectedOption}@${
        data.optionTemplates.selectedVersion
    }`;

    let str = printBoxStart('🚀  ReNative Project Generator');
    str += printIntoBox('');
    str += printIntoBox(
        `Project Name (folder): ${highlight(data.projectName)}`,
        1
    );
    str += printIntoBox(
        `Workspace: ${highlight(data.optionWorkspaces.selectedOption)}`,
        1
    );
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
    str += chalk()
        .gray(`│   ├── appConfigs            # Application flavour configuration files/assets │
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

const interactiveQuestion = async (results, bootstrapQuestions, key = '') => {
    if (bootstrapQuestions?.length) {
        for (let i = 0; i < bootstrapQuestions.length; i++) {
            const q = bootstrapQuestions[i];
            const choicesObj = {};
            if (q.options) {
                q.options.forEach((opt) => {
                    choicesObj[opt.title] = opt;
                });
            }
            const qKey = `${key}q${i}`;
            // inquirerObj[qKey] = { ...q, choicesObj };
            const inqQuestion = {
                name: qKey,
                type: q.type,
                message: q.title,
                choices: Object.keys(choicesObj),
            };
            // eslint-disable-next-line no-await-in-loop
            const result = await inquirer.prompt(inqQuestion);
            const val = q.type === 'list' ? choicesObj[result[qKey]]?.value : result[qKey];
            results[qKey] = {
                answer: result[qKey],
                configProp: q.configProp,
                value: val,
            };
            if (choicesObj[result[qKey]]?.bootstrapQuestions) {
                // eslint-disable-next-line no-await-in-loop
                await interactiveQuestion(
                    results,
                    choicesObj[result[qKey]].bootstrapQuestions,
                    qKey
                );
            }
        }
    }
};

export const taskRnvNew = async (c) => {
    logTask('taskRnvNew');
    const { rawArgs, ci } = c.program; // using rawArgs since 3rd argument is circular reference for some reason
    if (fsExistsSync(c.paths.project.config)) {
        logWarning(`You are in ReNative project. Found: ${c.paths.project.config}`);
        const { confirmInRnvProject } = await inquirer.prompt({
            name: 'confirmInRnvProject',
            type: 'confirm',
            message: 'Are you sure you want to continue?',
        });
        if (!confirmInRnvProject) {
            return Promise.reject('Cancelled');
        }
    }

    if (fsExistsSync(c.paths.project.nodeModulesDir)) {
        logWarning(
            `Found node_modules directory at your location. If you continue it will be deleted: ${
                c.paths.project.nodeModulesDir
            }`
        );
        const { confirmDeleteNodeModules } = await inquirer.prompt({
            name: 'confirmDeleteNodeModules',
            type: 'confirm',
            message: 'Are you sure you want to continue?',
        });
        if (confirmDeleteNodeModules) {
            await removeDirs([c.paths.project.nodeModulesDir]);
        }
    }

    let data = {
        defaultVersion: '0.1.0',
        defaultTemplate: 'renative-template-hello-world',
        defaultProjectName: 'helloRenative',
        defaultAppTitle: 'Hello Renative',
        defaultWorkspace: 'rnv',
    };
    data.optionPlatforms = {};
    data.optionTemplates = {};
    data.optionWorkspaces = getWorkspaceOptions(c);

    // ==================================================
    // INPUT: Project Name
    // ==================================================

    let inputProjectName;

    if (rawArgs[3] && rawArgs[3] !== '') {
        inputProjectName = rawArgs[3];
    } else {
        const inputProjectNameObj = await inquirer.prompt({
            name: 'inputProjectName',
            type: 'input',
            validate: value => !!value,
            message:
        "What's your project Name? (no spaces, folder based on ID will be created in this directory)",
        });
        inputProjectName = inputProjectNameObj?.inputProjectName;
    }

    data.projectName = inputProjectName;
    c.paths.project.dir = path.join(
        CURRENT_DIR,
        data.projectName.replace(/(\s+)/g, '_')
    );
    if (fsExistsSync(c.paths.project.dir)) {
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `Folder ${
                c.paths.project.dir
            } already exists. RNV will override it. Continue?`,
        });

        if (!confirm) {
            return Promise.reject('Cancelled by user');
        }
        await cleanFolder(c.paths.project.dir);
    }

    mkdirSync(c.paths.project.dir);

    // ==================================================
    // INPUT: Project Title, ID, Version
    // ==================================================
    let inputAppTitle;
    let inputAppID;
    let inputVersion;
    if (
        rawArgs[4]
    && rawArgs[4] !== ''
    && rawArgs[5]
    && rawArgs[5] !== ''
    && rawArgs[6]
    && rawArgs[6] !== ''
    ) {
        inputAppTitle = rawArgs[4];
        inputAppID = rawArgs[5];
        inputVersion = rawArgs[6];
    } else {
        const answers = await inquirer.prompt([
            {
                name: 'inputAppTitle',
                type: 'input',
                default: data.defaultAppTitle,
                validate: val => !!val || 'Please enter a title',
                message: "What's your project Title?",
            },
            {
                name: 'inputAppID',
                type: 'input',
                default: () => {
                    data.appID = `com.mycompany.${inputProjectName
                        .replace(/\s+/g, '')
                        .toLowerCase()}`;
                    return data.appID;
                },
                validate: id => !!id.match(/[a-z]+\.[a-z0-9]+\.[a-z0-9]+/)
          || 'Please enter a valid appID (com.test.app)',
                message: "What's your App ID?",
            },
            {
                name: 'inputVersion',
                type: 'input',
                default: data.defaultVersion,
                validate: v => !!semver.valid(semver.coerce(v))
          || 'Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.)',
                message: "What's your Version?",
            },
        ]);
        inputAppTitle = answers?.inputAppTitle;
        inputAppID = answers?.inputAppID;
        inputVersion = answers?.inputVersion;
    }

    // ==================================================
    // INPUT: Workspace
    // ==================================================
    let inputWorkspace;
    if (rawArgs[7] && rawArgs[7] !== '') {
        inputWorkspace = rawArgs[7];
    } else {
        const answer = await inquirer.prompt([
            {
                name: 'inputWorkspace',
                type: 'list',
                message: 'What workspace to use?',
                default: data.defaultWorkspace,
                choices: data.optionWorkspaces.keysAsArray,
            },
        ]);

        inputWorkspace = answer?.inputWorkspace;
    }
    data.optionWorkspaces.selectedOption = inputWorkspace;
    c.runtime.selectedWorkspace = inputWorkspace;

    await updateRenativeConfigs(c);
    data.optionTemplates = getTemplateOptions(c);

    // ==================================================
    // INPUT: Template
    // ==================================================
    const customTemplate = 'Custom Template ...';

    data.optionTemplates.keysAsArray.push(customTemplate);
    let selectedInputTemplate;
    if (rawArgs[8] && rawArgs[8] !== '') {
        selectedInputTemplate = rawArgs[8];
    } else {
        const { inputTemplate } = await inquirer.prompt({
            name: 'inputTemplate',
            type: 'list',
            message: 'What template to use?',
            default: data.defaultTemplate,
            choices: data.optionTemplates.keysAsArray,
        });


        if (inputTemplate === customTemplate) {
            const { inputTemplateCustom } = await inquirer.prompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'Type exact name of your template NPM package.',
            });
            selectedInputTemplate = inputTemplateCustom;
        } else {
            selectedInputTemplate = inputTemplate;
        }
    }

    data.optionTemplates.selectedOption = selectedInputTemplate;

    let inputTemplateVersion;
    if (rawArgs[9] && rawArgs[9] !== '') {
        inputTemplateVersion = rawArgs[9];
    } else {
        inputTemplateVersion = await listAndSelectNpmVersion(
            c,
            data.optionTemplates.selectedOption,
            Object.keys(c.files.rnv.projectTemplates.config.projectTemplates)
        );
    }

    data.optionTemplates.selectedVersion = inputTemplateVersion;

    await executeAsync(
        `npm i ${selectedInputTemplate}@${inputTemplateVersion} --no-save`,
        {
            cwd: c.paths.project.dir,
        }
    );

    if (!data.optionTemplates.keysAsArray.includes(selectedInputTemplate)) {
        const { confirmAddTemplate } = await inquirer.prompt({
            name: 'confirmAddTemplate',
            type: 'confirm',
            message: `Would you like to add ${chalk().white(
                selectedInputTemplate
            )} to your ${c.runtime.selectedWorkspace} workspace template list?`,
        });

        if (confirmAddTemplate) {
            if (!c.files.workspace.config?.projectTemplates) {
                c.files.workspace.config.projectTemplates = {};
            }
            c.files.workspace.config.projectTemplates[selectedInputTemplate] = {};
            writeObjectSync(c.paths.workspace.config, c.files.workspace.config);
            await updateRenativeConfigs(c);

            logInfo(`Updating ${c.paths.workspace.config}...DONE`);
        }
    }

    const renativeTemplateConfig = readObjectSync(
        path.join(
            c.paths.project.dir,
            'node_modules',
            selectedInputTemplate,
            'renative.template.json'
        )
    );

    // ==================================================
    // INPUT: Supported Platforms
    // ==================================================

    const supportedPlatforms = renativeTemplateConfig?.defaults?.supportedPlatforms || [];
    let inputSupportedPlatforms;
    if (rawArgs[10] && rawArgs[10] !== '') {
        inputSupportedPlatforms = rawArgs[10].split(',');
    } else {
        const answer = await inquirer.prompt({
            name: 'inputSupportedPlatforms',
            type: 'checkbox',
            pageSize: 20,
            message: 'What platforms would you like to use?',
            validate: val => !!val.length || 'Please select at least a platform',
            default: supportedPlatforms,
            choices: supportedPlatforms,
        });
        inputSupportedPlatforms = answer?.inputSupportedPlatforms;
    }

    // ==================================================
    // INPUT: Custom Questions
    // ==================================================
    const renativeTemplateConfigExt = {};
    const bootstrapQuestions = renativeTemplateConfig?.templateConfig?.bootstrapQuestions;
    const results = {};
    await interactiveQuestion(results, bootstrapQuestions);

    Object.keys(results).forEach((k) => {
        const objValue = results[k].value;

        const targetKey = results[k].configProp.key;

        if (targetKey) {
            lSet(renativeTemplateConfigExt, targetKey, objValue);
        }
    });

    // ==================================================
    // INPUT: Git Enabled
    // ==================================================

    const { gitEnabled } = await inquirer.prompt({
        name: 'gitEnabled',
        type: 'confirm',
        message: 'Do you want to set-up git in your new project?',
    });

    // ==================================================
    // INPUT: Confirm Overview
    // ==================================================
    data = {
        ...data,
        inputProjectName,
        inputAppTitle,
        inputAppID,
        inputVersion,
        inputTemplate: selectedInputTemplate,
        inputSupportedPlatforms,
        inputWorkspace,
        gitEnabled,
    };
    data.optionPlatforms.selectedOptions = inputSupportedPlatforms;

    _prepareProjectOverview(c, data);
    if (!ci) {
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `\n${data.confirmString}\nIs all this correct?`,
        });

        if (!confirm) {
            return;
        }
    }


    // ==================================================
    // Setup Project

    try {
        await Analytics.captureEvent({
            type: 'newProject',
            template: selectedInputTemplate,
            platforms: inputSupportedPlatforms,
        });
    } catch (e) {
        logDebug(e);
    }

    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.config = path.join(c.paths.project.dir, RENATIVE_CONFIG_NAME);

    data.packageName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

    const templates = {};

    logTask(
        `_generateProject:${data.optionTemplates.selectedOption}:${
            data.optionTemplates.selectedVersion
        }`,
        chalk().grey
    );

    templates[data.optionTemplates.selectedOption] = {
        version: data.optionTemplates.selectedVersion,
    };

    const config = {
        ...renativeTemplateConfig,
        ...renativeTemplateConfigExt,
        projectName: data.projectName,
        workspaceID: data.optionWorkspaces.selectedOption,
        paths: {
            appConfigsDir: './appConfigs',
            entryDir: './',
            platformAssetsDir: './platformAssets',
            platformBuildsDir: './platformBuilds',
        },
        defaults: {
            title: data.appTitle,
            id: data.appID,
            supportedPlatforms: data.optionPlatforms.selectedOptions,
        },
        templates,
        currentTemplate: data.optionTemplates.selectedOption,
        isNew: true,
        isMonorepo: false,
    };
    delete config.templateConfig;

    writeFileSync(c.paths.project.config, config);

    if (data.gitEnabled) {
        await checkAndCreateGitignore(c);
        await configureGit(c);
    }
    logSuccess(
        `Your project is ready! navigate to project ${chalk().white(
            `cd ${data.projectName}`
        )} and run ${chalk().white('rnv run')} to see magic happen!`
    );
};

export default {
    description: 'Create new ReNative project',
    fn: taskRnvNew,
    task: 'new',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};
