import lSet from 'lodash.set';
import path from 'path';
import semver from 'semver';
import {
    RENATIVE_CONFIG_NAME,
    PARAMS,
    RENATIVE_CONFIG_TEMPLATE_NAME,
    getTemplateOptions,
    mkdirSync,
    writeFileSync,
    cleanFolder,
    fsExistsSync,
    readObjectSync,
    removeDirs,
    checkAndCreateGitignore,
    getWorkspaceOptions,
    updateRenativeConfigs,
    executeAsync,
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
    isYarnInstalled,
    listAndSelectNpmVersion,
    RnvContext,
    getApi,
    inquirerPrompt,
    PlatformKey,
    commandExistsSync,
    PromptParams,
    RnvTask,
    TASK_NEW,
} from '@rnv/core';
import { ConfigFileProject, ConfigFileTemplate } from '@rnv/core/lib/schema/configFiles/types';

type NewProjectData = {
    appTitle?: string;
    inputAppTitle?: string;
    packageName?: string;
    defaultAppTitle?: string;
    defaultTemplate?: string;
    inputProjectName?: string;
    teamID?: string;
    appID?: string;
    inputAppID?: string;
    inputVersion?: string;
    defaultVersion: string;
    inputTemplate?: string;
    version?: string;
    optionTemplates: {
        selectedOption?: string;
        selectedVersion?: string;
        valuesAsObject?: Record<
            string,
            {
                title: string;
                key: string;
                description: string;
            }
        >;
        valuesAsArray?: Array<{
            title: string;
            key: string;
        }>;
        keysAsArray?: Array<string>;
    };
    projectName?: string;
    optionWorkspaces: {
        selectedOption?: string;
        valuesAsObject?: Record<
            string,
            {
                title: string;
                key: string;
            }
        >;
        valuesAsArray?: Array<string>;
        keysAsArray?: Array<string>;
    };
    gitEnabled?: boolean;
    optionPlatforms: {
        selectedOptions?: Array<PlatformKey>;
    };
    confirmString?: string;
    defaultProjectName?: string;
    defaultWorkspace?: string;
    inputSupportedPlatforms?: Array<string>;
    inputWorkspace?: string;
};

export const configureGit = async (c: RnvContext) => {
    const projectPath = c.paths.project.dir;
    logTask(`configureGit:${projectPath}`);

    if (!fsExistsSync(path.join(projectPath, '.git'))) {
        logInfo('Your project does not have a git repo. Creating one...DONE');
        if (commandExistsSync('git')) {
            await executeAsync('git init', { cwd: projectPath });
            await executeAsync('git add -A', { cwd: projectPath });
            await executeAsync('git commit -m "Initial"', { cwd: projectPath });
        } else {
            logWarning("We tried to create a git repo inside your project but you don't seem to have git installed");
        }
    }
};
const checkInputValue = (value: string | boolean): boolean => {
    return value && typeof value === 'string' && value !== '' ? true : false;
};
const _prepareProjectOverview = (c: RnvContext, data: NewProjectData) => {
    data.appTitle = data.inputAppTitle || data.defaultAppTitle;
    data.teamID = '';
    data.appID = data.inputAppID ? data.inputAppID.replace(/\s+/g, '-').toLowerCase() : data.appID;
    data.version = data.inputVersion || data.defaultVersion;
    const tempString = `${data.optionTemplates.selectedOption}@${data.optionTemplates.selectedVersion}`;

    const highlight = chalk().green;

    let str = printBoxStart('🚀  ReNative Project Generator');
    str += printIntoBox('');
    str += printIntoBox(`Project Name (folder): ${highlight(data.projectName)}`);
    str += printIntoBox(`Workspace: ${highlight(data.optionWorkspaces.selectedOption)}`);
    str += printIntoBox(`Project Title: ${highlight(data.appTitle)}`);
    str += printIntoBox(`Project Version: ${highlight(data.version)}`);
    str += printIntoBox(`App ID: ${highlight(data.appID)}`);
    str += printIntoBox(`Project Template: ${highlight(tempString)}`);
    str += printIntoBox(`Git Enabled: ${highlight(data.gitEnabled)}`);
    str += printIntoBox('');
    str += printIntoBox('Project Platforms:');
    str += printArrIntoBox(data.optionPlatforms.selectedOptions || []);
    str += printIntoBox('');
    str += printIntoBox('Project Structure:');
    str += printIntoBox('');
    str += printIntoBox(data.projectName || 'UNKNOWN');
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

type ConfigProp = Required<ConfigFileTemplate>['templateConfig']['bootstrapQuestions'][number]['configProp'];

type QuestionResults = Record<
    string,
    {
        answer: string;
        configProp: ConfigProp;
        value: string;
    }
>;

type BootstrapQuestions = Required<ConfigFileTemplate>['templateConfig']['bootstrapQuestions'];

const interactiveQuestion = async (
    results: QuestionResults,
    bootstrapQuestions: BootstrapQuestions,
    providedAnswers: Record<string, string>
) => {
    if (bootstrapQuestions?.length) {
        for (let i = 0; i < bootstrapQuestions.length; i++) {
            const q = bootstrapQuestions[i];
            const qKey = q?.configProp?.key || '';
            // inquirer will nest them if they look like an object
            const qKeyClean = qKey.replace('.', '__');

            const choicesObj: Record<string, any> = {};
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
                const inqQuestion: PromptParams = {
                    name: qKeyClean,
                    type: q.type,
                    message: q.title,
                    choices: Object.keys(choicesObj),
                };
                // eslint-disable-next-line no-await-in-loop
                const result = await inquirerPrompt(inqQuestion);
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

export const taskRnvNew = async (c: RnvContext) => {
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
        const { confirmInRnvProject } = await inquirerPrompt({
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
        const { confirmDeleteNodeModules } = await inquirerPrompt({
            name: 'confirmDeleteNodeModules',
            type: 'confirm',
            message: 'Are you sure you want to continue?',
        });
        if (confirmDeleteNodeModules) {
            await removeDirs([c.paths.project.nodeModulesDir]);
        }
    }

    let data: NewProjectData = {
        defaultVersion: '0.1.0',
        defaultTemplate: '@rnv/template-starter',
        defaultProjectName: 'helloRenative',
        defaultAppTitle: 'Hello Renative',
        defaultWorkspace: 'rnv',
        optionPlatforms: {},
        optionTemplates: {},
        optionWorkspaces: {},
    };
    data.optionPlatforms = {};
    data.optionTemplates = {};
    data.optionWorkspaces = getWorkspaceOptions(c);

    // ==================================================
    // INPUT: Project Name
    // ==================================================

    let inputProjectName: string;

    if (checkInputValue(projectName)) {
        inputProjectName = projectName;
    } else {
        const inputProjectNameObj = await inquirerPrompt({
            name: 'inputProjectName',
            type: 'input',
            validate: (value) => checkInputValue(value),
            message: "What's your project Name? (no spaces, folder based on ID will be created in this directory)",
        });
        inputProjectName = inputProjectNameObj?.inputProjectName;
    }

    data.projectName = inputProjectName.replace(/(\s+)/g, '_');
    c.paths.project.dir = path.join(c.paths.CURRENT_DIR, data.projectName);

    if (fsExistsSync(c.paths.project.dir)) {
        const { confirm } = await inquirerPrompt({
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

    const validator = {
        validateAppTitle: (val: string) => checkInputValue(val) || 'Please enter a title',
        validateAppID: (appId: string) =>
            (typeof appId === 'string' && !!appId.match(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/)) ||
            'Please enter a valid appID (com.test.app)',
        validateAppVersion: (version: string) =>
            !!semver.valid(semver.coerce(version)) ||
            'Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.)',
    };

    const inputValues = [
        {
            value: title,
            validFn: validator.validateAppTitle,
            name: 'inputAppTitle',
            defaultVal: data.defaultAppTitle,
            message: "What's your project Title?",
            warning: 'Title was not provided',
        },
        {
            value: id,
            validFn: validator.validateAppID,
            name: 'inputAppID',
            defaultVal: () => {
                data.appID = `com.mycompany.${inputProjectName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
                return data.appID;
            },
            message: "What's your App ID?",
            warning: `Command contains invalid appId : ${id}`,
        },
        {
            value: appVersion,
            validFn: validator.validateAppVersion,
            name: 'inputVersion',
            defaultVal: data.defaultVersion,
            message: "What's your Version?",
            warning: `Command contains invalid appVersion. Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.`,
        },
    ];

    const validateAndAssign = async ({
        value,
        validFn,
        name,
        defaultVal,
        message,
        warning,
    }: {
        value: string;
        validFn: (value: string) => true | string;
        name: string;
        defaultVal: (() => string) | string | undefined;
        message: string;
        warning: string;
    }): Promise<string> => {
        const isValid = validFn(value);
        if (value && isValid === true) {
            return value;
        } else {
            const warningMessage = typeof isValid === 'string';
            const answer = await inquirerPrompt({
                name,
                type: 'input',
                default: defaultVal,
                validate: validFn,
                message,
                warningMessage: ci && warningMessage && warning,
            });
            return answer[name];
        }
    };
    const inputsResult = [];
    for (const value of inputValues) {
        const res = await validateAndAssign(value);
        inputsResult.push(res);
    }

    const [inputAppTitle, inputAppID, inputVersion] = inputsResult;

    // ==================================================
    // INPUT: Workspace
    // ==================================================
    let inputWorkspace;
    if (checkInputValue(workspace)) {
        inputWorkspace = workspace;
    } else if (ci) {
        inputWorkspace = data.defaultWorkspace;
    } else {
        const answer = await inquirerPrompt({
            name: 'inputWorkspace',
            type: 'list',
            message: 'What workspace to use?',
            default: data.defaultWorkspace,
            choices: data.optionWorkspaces.keysAsArray,
        });

        inputWorkspace = answer?.inputWorkspace;
    }
    data.optionWorkspaces.selectedOption = inputWorkspace;
    c.runtime.selectedWorkspace = inputWorkspace;

    await updateRenativeConfigs(c);
    data.optionTemplates = getTemplateOptions(c);

    const options = [];
    const values = data.optionTemplates.valuesAsObject;
    if (values) {
        Object.keys(values).forEach((k) => {
            const val = values[k];
            if (val.description) {
                val.title = `${k} ${chalk().grey(`- ${val.description}`)}`;
            } else {
                val.title = k;
            }

            val.key = k;
            options.push(val.title);
        });
    }

    const getTemplateKey = (val: string) => data.optionTemplates.valuesAsArray?.find((v) => v.title === val)?.key;

    // ==================================================
    // INPUT: Template
    // ==================================================
    const customTemplate = 'Custom Template ...';

    // data.optionTemplates.keysAsArray.push(customTemplate);
    options.push(customTemplate);
    let selectedInputTemplate;
    if (checkInputValue(projectTemplate)) {
        selectedInputTemplate = projectTemplate;
    } else {
        const { inputTemplate } = await inquirerPrompt({
            name: 'inputTemplate',
            type: 'list',
            message: 'What template to use?',
            default: data.defaultTemplate,
            choices: options,
        });

        if (inputTemplate === customTemplate) {
            const { inputTemplateCustom } = await inquirerPrompt({
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
    if (checkInputValue(templateVersion)) {
        inputTemplateVersion = templateVersion;
    } else {
        inputTemplateVersion = await listAndSelectNpmVersion(c, data.optionTemplates.selectedOption || '');
    }

    data.optionTemplates.selectedVersion = inputTemplateVersion;

    await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add ${selectedInputTemplate}@${inputTemplateVersion}`, {
        cwd: c.paths.project.dir,
    });

    // Add rnv to package.json
    await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add rnv@${c.rnvVersion}`, {
        cwd: c.paths.project.dir,
    });
    // Add pkg-dir to have the correct version before the first run
    await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add pkg-dir@7.0.0`, {
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

    if (!data.optionTemplates.keysAsArray?.includes(selectedInputTemplate)) {
        const { confirmAddTemplate } = await inquirerPrompt({
            name: 'confirmAddTemplate',
            type: 'confirm',
            message: `Would you like to add ${chalk().white(selectedInputTemplate)} to your ${
                c.runtime.selectedWorkspace
            } workspace template list?`,
        });

        const configFile = c.files.workspace.config;

        if (configFile) {
            if (confirmAddTemplate) {
                if (!configFile.projectTemplates) {
                    configFile.projectTemplates = {};
                }
                configFile.projectTemplates[selectedInputTemplate] = {};
                writeFileSync(c.paths.workspace.config, configFile);
                await updateRenativeConfigs(c);

                logInfo(`Updating ${c.paths.workspace.config}...DONE`);
            }
        }
    }

    const renativeTemplateConfig =
        readObjectSync<ConfigFileTemplate>(
            path.join(c.paths.project.dir, 'node_modules', selectedInputTemplate, RENATIVE_CONFIG_TEMPLATE_NAME)
        ) || {};

    const renativeConfig = readObjectSync<ConfigFileProject>(
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
    if (checkInputValue(platform)) {
        inputSupportedPlatforms = platform.split(',');
    } else {
        const answer = await inquirerPrompt({
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
    const bootstrapQuestions = renativeTemplateConfig?.templateConfig?.bootstrapQuestions || [];
    const results: QuestionResults = {};
    const providedAnswers: Record<string, any> = {};

    if (c.program.answer) {
        c.program.answer.forEach((a: string) => {
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

    logDebug('asnwer', JSON.stringify(results, null, 2));

    Object.keys(results).forEach((targetKey) => {
        const objValue = results[targetKey].value;

        logDebug('setting', targetKey, objValue);

        if (targetKey) {
            lSet(renativeTemplateConfigExt, targetKey, objValue);
        }
    });

    let isGitEnabled = gitEnabled === 'true' || gitEnabled === true;
    // ==================================================
    // INPUT: Git Enabled
    // ==================================================
    if (gitEnabled === undefined && !ci) {
        const response = await inquirerPrompt({
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
        const { confirm } = await inquirerPrompt({
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
        await getApi().analytics.captureEvent({
            type: 'newProject',
            template: selectedInputTemplate,
            platforms: inputSupportedPlatforms,
        });
    } catch (e) {
        logDebug(e);
    }

    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.config = path.join(c.paths.project.dir, RENATIVE_CONFIG_NAME);

    data.packageName = data?.appTitle?.replace(/\s+/g, '-').toLowerCase();

    const templates: Record<
        string,
        {
            version: string;
        }
    > = {};

    logTask(
        `_generateProject:${data.optionTemplates.selectedOption}:${data.optionTemplates.selectedVersion}`,
        chalk().grey
    );

    if (!data.optionTemplates.selectedVersion) {
        return;
    }

    if (data.optionTemplates.selectedOption) {
        templates[data.optionTemplates.selectedOption] = {
            version: data.optionTemplates.selectedVersion,
        };
    }

    delete renativeTemplateConfig.templateConfig;

    if (!data.optionTemplates.selectedOption) {
        logError('Current template not selected!');
        return;
    }

    const config: ConfigFileProject = {
        platforms: {},
        ...renativeTemplateConfig,
        ...renativeTemplateConfigExt,
        projectName: data.projectName || 'my-project',
        projectVersion: data.inputVersion || '0.1.0',
        //TODO: TEMPORARY WORKAROUND this neds to use bootstrap_metadata to work properly
        common: {
            id: data.inputAppID || 'com.mycompany.myapp',
            title: data.inputAppTitle || 'My App',
        },
        workspaceID: data.optionWorkspaces.selectedOption || 'project description',
        // paths: {
        //     appConfigsDir: './appConfigs',
        //     entryDir: './',
        //     platformAssetsDir: './platformAssets',
        //     platformBuildsDir: './platformBuilds',
        // },
        defaults: {
            supportedPlatforms: data.optionPlatforms.selectedOptions,
        },
        engines: {},
        templates,
        currentTemplate: data.optionTemplates.selectedOption,
        isNew: true,
        isMonorepo: false,
    };

    const platforms: ConfigFileProject['platforms'] = config.platforms || {};
    const engines: ConfigFileProject['engines'] = config.engines || {};
    const defaults: ConfigFileProject['defaults'] = config.defaults || {};

    const supPlats = defaults.supportedPlatforms || [];

    // Remove unused platforms
    Object.keys(platforms).forEach((k) => {
        const key = k as PlatformKey;
        if (!supPlats.includes(key)) {
            delete platforms[key];
        }
    });

    const tplEngines = renativeTemplateConfig.engines;
    if (tplEngines) {
        // Remove unused engines based on selected platforms
        supPlats.forEach((k) => {
            const selectedEngineId =
                platforms[k]?.engine || c.files.rnv.projectTemplates.config?.platformTemplates?.[k]?.engine;
            if (selectedEngineId) {
                const selectedEngine = findEngineKeyById(c, selectedEngineId);
                if (selectedEngine?.key) {
                    engines[selectedEngine.key] = tplEngines[selectedEngine.key];
                }
            }
        });
    }

    config.platforms = platforms;
    config.engines = engines;
    config.defaults = defaults;

    writeFileSync(c.paths.project.config, config);

    if (data.gitEnabled) {
        await checkAndCreateGitignore(c);
        await configureGit(c);
    }

    logSuccess(
        `Your project is ready! navigate to project ${chalk().white(`cd ${data.projectName}`)} and run ${chalk().white(
            'npx rnv run'
        )} to see magic happen!`
    );

    return true;
};

const findEngineKeyById = (c: RnvContext, id: string) => {
    const engineTemplates = c.files.rnv.projectTemplates.config?.engineTemplates;
    if (engineTemplates) {
        const etk = Object.keys(engineTemplates);
        for (let i = 0; i < etk.length; i++) {
            const engine = engineTemplates[etk[i]];
            if (engine) {
                if (engine.id === id) {
                    engine.key = etk[i];
                    return engine;
                }
            }
        }
    }
};

const Task: RnvTask = {
    description: 'Create new ReNative project',
    fn: taskRnvNew,
    task: TASK_NEW,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPriorityOrder: true,
};

export default Task;
