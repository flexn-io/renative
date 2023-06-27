import inquirer from 'inquirer';
import lSet from 'lodash.set';
import path from 'path';
import semver from 'semver';
import { RENATIVE_CONFIG_NAME, CURRENT_DIR, PARAMS, RENATIVE_CONFIG_TEMPLATE_NAME } from '../../core/constants';
import { getTemplateOptions } from '../../core/templateManager';
import {
    mkdirSync,
    writeFileSync,
    cleanFolder,
    fsExistsSync,
    readObjectSync,
    removeDirs,
} from '../../core/systemManager/fileutils';
import { checkAndCreateGitignore } from '../../core/projectManager';
import { getWorkspaceOptions } from '../../core/projectManager/workspace';
import { updateRenativeConfigs } from '../../core/runtimeManager';
import Analytics from '../../core/systemManager/analytics';
import { executeAsync } from '../../core/systemManager/exec';

import { configureGit } from '../../core/systemManager/gitUtils';
import {
    chalk,
    logDebug,
    logInfo,
    logSuccess,
    logTask,
    logError,
    logWarning,
    printArrIntoBox,
    printBoxEnd,
    printBoxStart,
    printIntoBox,
} from '../../core/systemManager/logger';
import { isYarnInstalled, listAndSelectNpmVersion } from '../../core/systemManager/npmUtils';

const highlight = chalk().green;

const _prepareProjectOverview = (c, data) => {
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
    str += chalk().gray(`│   ├── appConfigs            # Application flavour configuration files/assets │
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

const interactiveQuestion = async (results, bootstrapQuestions, providedAnswers) => {
    if (bootstrapQuestions?.length) {
        for (let i = 0; i < bootstrapQuestions.length; i++) {
            const q = bootstrapQuestions[i];
            const qKey = q.configProp.key;
            // inquirer will nest them if they look like an object
            const qKeyClean = qKey.replace('.', '__');

            const choicesObj = {};
            if (q.options) {
                q.options.forEach((opt) => {
                    choicesObj[opt.title] = opt;
                });
            }

            // answer already passed into the command line
            const answer = providedAnswers[qKey.replace('__', '.')];
            if (answer) {
                let value;
                if (typeof answer === 'string' && q.type === 'list') {
                    value = choicesObj[answer]?.value;
                } else {
                    value = answer;
                }

                results[qKey] = {
                    answer,
                    configProp: q.configProp,
                    value,
                };
            } else {
                const inqQuestion = {
                    name: qKeyClean,
                    type: q.type,
                    message: q.title,
                    choices: Object.keys(choicesObj),
                };
                // eslint-disable-next-line no-await-in-loop
                const result = await inquirer.prompt(inqQuestion);
                const val = q.type === 'list' ? choicesObj[result[qKeyClean]]?.value : result[qKeyClean];
                results[qKey] = {
                    answer: result[qKeyClean],
                    configProp: q.configProp,
                    value: val,
                };
            }

            if (choicesObj[results[qKey].answer]?.bootstrapQuestions) {
                // eslint-disable-next-line no-await-in-loop
                await interactiveQuestion(
                    results,
                    choicesObj[results[qKey].answer].bootstrapQuestions,
                    providedAnswers
                );
            }
        }
    }
};

export const taskRnvNew = async (c) => {
    logTask('taskRnvNew');
    const {
        ci,
        projectName,
        title,
        id,
        appVersion,
        workspace,
        projectTemplate,
        templateVersion,
        platform,
        gitEnabled,
    } = c.program;

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
            `Found node_modules directory at your location. If you continue it will be deleted: ${c.paths.project.nodeModulesDir}`
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
        defaultTemplate: '@rnv/template-starter',
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

    if (projectName && projectName !== '') {
        inputProjectName = projectName;
    } else {
        const inputProjectNameObj = await inquirer.prompt({
            name: 'inputProjectName',
            type: 'input',
            validate: (value) => !!value,
            message: "What's your project Name? (no spaces, folder based on ID will be created in this directory)",
        });
        inputProjectName = inputProjectNameObj?.inputProjectName;
    }

    data.projectName = inputProjectName;
    c.paths.project.dir = path.join(CURRENT_DIR, data.projectName.replace(/(\s+)/g, '_'));

    if (fsExistsSync(c.paths.project.dir)) {
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `Folder ${c.paths.project.dir} already exists. RNV will override it. Continue?`,
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
    if (title && title !== '' && id && id !== '' && appVersion && appVersion !== '') {
        inputAppTitle = title;
        inputAppID = id;
        inputVersion = appVersion;
    } else {
        const answers = await inquirer.prompt([
            {
                name: 'inputAppTitle',
                type: 'input',
                default: data.defaultAppTitle,
                validate: (val) => !!val || 'Please enter a title',
                message: "What's your project Title?",
            },
            {
                name: 'inputAppID',
                type: 'input',
                default: () => {
                    data.appID = `com.mycompany.${inputProjectName.replace(/\s+/g, '').toLowerCase()}`;
                    return data.appID;
                },
                validate: (appId) =>
                    !!appId.match(/[a-z]+\.[a-z0-9]+\.[a-z0-9]+/) || 'Please enter a valid appID (com.test.app)',
                message: "What's your App ID?",
            },
            {
                name: 'inputVersion',
                type: 'input',
                default: data.defaultVersion,
                validate: (v) =>
                    !!semver.valid(semver.coerce(v)) ||
                    'Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.)',
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
    if (workspace && workspace !== '') {
        inputWorkspace = workspace;
    } else if (ci) {
        inputWorkspace = data.defaultWorkspace;
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

    const options = [];

    Object.keys(data.optionTemplates.valuesAsObject).forEach((k) => {
        const val = data.optionTemplates.valuesAsObject[k];
        if (val.description) {
            val.title = `${k} ${chalk().grey(`- ${val.description}`)}`;
        } else {
            val.title = k;
        }

        val.key = k;
        options.push(val.title);
    });

    const getTemplateKey = (val) => data.optionTemplates.valuesAsArray.find((v) => v.title === val)?.key;

    // ==================================================
    // INPUT: Template
    // ==================================================
    const customTemplate = 'Custom Template ...';

    // data.optionTemplates.keysAsArray.push(customTemplate);
    options.push(customTemplate);
    let selectedInputTemplate;
    if (projectTemplate && projectTemplate !== '') {
        selectedInputTemplate = projectTemplate;
    } else {
        const { inputTemplate } = await inquirer.prompt({
            name: 'inputTemplate',
            type: 'list',
            message: 'What template to use?',
            default: data.defaultTemplate,
            choices: options,
        });

        if (inputTemplate === customTemplate) {
            const { inputTemplateCustom } = await inquirer.prompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'Type exact name of your template NPM package.',
            });
            selectedInputTemplate = inputTemplateCustom;
        } else {
            selectedInputTemplate = getTemplateKey(inputTemplate);
        }
    }

    data.optionTemplates.selectedOption = selectedInputTemplate;

    let inputTemplateVersion;
    if (templateVersion && templateVersion !== '') {
        inputTemplateVersion = templateVersion;
    } else {
        inputTemplateVersion = await listAndSelectNpmVersion(
            c,
            data.optionTemplates.selectedOption,
            Object.keys(c.files.rnv.projectTemplates.config.projectTemplates)
        );
    }

    data.optionTemplates.selectedVersion = inputTemplateVersion;

    await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add ${selectedInputTemplate}@${inputTemplateVersion}`, {
        cwd: c.paths.project.dir,
    });

    // Check if node_modules folder exists
    if (!fsExistsSync(path.join(c.paths.project.dir, 'node_modules'))) {
        logError(
            `${
                isYarnInstalled() ? 'yarn' : 'npm'
            } add ${selectedInputTemplate}@${inputTemplateVersion} : FAILED. this could happen if you have package.json accidentally created somewhere in parent directory`
        );
        return;
    }

    if (!data.optionTemplates.keysAsArray.includes(selectedInputTemplate)) {
        const { confirmAddTemplate } = await inquirer.prompt({
            name: 'confirmAddTemplate',
            type: 'confirm',
            message: `Would you like to add ${chalk().white(selectedInputTemplate)} to your ${
                c.runtime.selectedWorkspace
            } workspace template list?`,
        });

        if (confirmAddTemplate) {
            if (!c.files.workspace.config?.projectTemplates) {
                c.files.workspace.config.projectTemplates = {};
            }
            c.files.workspace.config.projectTemplates[selectedInputTemplate] = {};
            writeFileSync(c.paths.workspace.config, c.files.workspace.config);
            await updateRenativeConfigs(c);

            logInfo(`Updating ${c.paths.workspace.config}...DONE`);
        }
    }

    const renativeTemplateConfig = readObjectSync(
        path.join(c.paths.project.dir, 'node_modules', selectedInputTemplate, RENATIVE_CONFIG_TEMPLATE_NAME)
    );

    const renativeConfig = readObjectSync(
        path.join(c.paths.project.dir, 'node_modules', selectedInputTemplate, RENATIVE_CONFIG_NAME)
    );

    // ==================================================
    // INPUT: Supported Platforms
    // ==================================================

    const supportedPlatforms =
        renativeTemplateConfig?.defaults?.supportedPlatforms || renativeConfig?.defaults?.supportedPlatforms || [];

    if (supportedPlatforms.length === 0) {
        logError(
            `Template ${selectedInputTemplate} does not seem to export any default platforms to support. contact the author.`
        );
    }

    let inputSupportedPlatforms;
    if (platform && platform !== '') {
        inputSupportedPlatforms = platform.split(',');
    } else {
        const answer = await inquirer.prompt({
            name: 'inputSupportedPlatforms',
            type: 'checkbox',
            pageSize: 20,
            message: 'What platforms would you like to use?',
            validate: (val) => !!val.length || 'Please select at least a platform',
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
    const providedAnswers = {};

    if (c.program.answer) {
        c.program.answer.forEach((a) => {
            const key = a.split('=')[0];
            let value;

            try {
                value = JSON.parse(a.split('=')[1]);
            } catch (e) {
                value = a.split('=')[1];
            }

            providedAnswers[key] = value;
        });
    }

    await interactiveQuestion(results, bootstrapQuestions, providedAnswers);

    console.log('asnwer', JSON.stringify(results, null, 2));

    Object.keys(results).forEach((targetKey) => {
        const objValue = results[targetKey].value;

        console.log('setting', targetKey, objValue);

        if (targetKey) {
            lSet(renativeTemplateConfigExt, targetKey, objValue);
        }
    });

    let isGitEnabled = gitEnabled === 'true' || gitEnabled === true;
    // ==================================================
    // INPUT: Git Enabled
    // ==================================================
    if (gitEnabled === undefined && !ci) {
        const response = await inquirer.prompt({
            name: 'gitEnabled',
            type: 'confirm',
            message: 'Do you want to set-up git in your new project?',
        });

        isGitEnabled = response.gitEnabled;
    }

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
        gitEnabled: isGitEnabled,
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
        `_generateProject:${data.optionTemplates.selectedOption}:${data.optionTemplates.selectedVersion}`,
        chalk().grey
    );

    templates[data.optionTemplates.selectedOption] = {
        version: data.optionTemplates.selectedVersion,
    };

    const config = {
        platforms: {},
        ...renativeTemplateConfig,
        ...renativeTemplateConfigExt,
        projectName: data.projectName,
        workspaceID: data.optionWorkspaces.selectedOption,
        // paths: {
        //     appConfigsDir: './appConfigs',
        //     entryDir: './',
        //     platformAssetsDir: './platformAssets',
        //     platformBuildsDir: './platformBuilds',
        // },
        defaults: {
            title: data.appTitle,
            id: data.appID,
            supportedPlatforms: data.optionPlatforms.selectedOptions,
        },
        engines: {},
        templates,
        currentTemplate: data.optionTemplates.selectedOption,
        isNew: true,
        isMonorepo: false,
    };

    const { supportedPlatforms: supPlats } = config.defaults;

    // Remove unused platforms
    Object.keys(config.platforms).forEach((k) => {
        if (!supPlats.includes(k)) {
            delete config.platforms[k];
        }
    });

    if (renativeTemplateConfig.engines) {
        // Remove unused engines based on selected platforms
        supPlats.forEach((k) => {
            const selectedEngineId =
                config.platforms[k]?.engine || c.files.rnv.projectTemplates.config.platforms[k]?.engine;
            if (selectedEngineId) {
                const selectedEngine = findEngineKeyById(c, selectedEngineId);
                config.engines[selectedEngine.key] = renativeTemplateConfig.engines[selectedEngine.key];
            }
        });
    }

    delete config.templateConfig;
    if (!config.platforms) {
        config.platforms = {};
    }

    writeFileSync(c.paths.project.config, config);

    if (data.gitEnabled) {
        await checkAndCreateGitignore(c);
        await configureGit(c);
    }
    logSuccess(
        `Your project is ready! navigate to project ${chalk().white(`cd ${data.projectName}`)} and run ${chalk().white(
            'rnv run'
        )} to see magic happen!`
    );
};

const findEngineKeyById = (c, id) => {
    const { engineTemplates } = c.files.rnv.projectTemplates.config;
    const etk = Object.keys(engineTemplates);
    for (let i = 0; i < etk.length; i++) {
        const engine = engineTemplates[etk[i]];
        if (engine.id === id) {
            engine.key = etk[i];
            return engine;
        }
    }
};

export default {
    description: 'Create new ReNative project',
    fn: taskRnvNew,
    task: 'new',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};
