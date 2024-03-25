import {
    PlatformKey,
    RnvFileName,
    chalk,
    getApi,
    getContext,
    inquirerPrompt,
    isYarnInstalled,
    logDebug,
    populateContextPaths,
    updateRenativeConfigs,
    writeFileSync,
} from '@rnv/core';
import path from 'path';
import { NewProjectData } from './types';

export const processChdirToProject = async () => {
    const c = getContext();
    // In order to execute rnv from new origin (sub folder we need to reset paths to new cwd())
    process.chdir(c.paths.project.dir);
    populateContextPaths(c, c.paths.rnv.dir);
    return true;
};

export const checkInputValue = (value: string | boolean): boolean => {
    return value && typeof value === 'string' && value !== '' ? true : false;
};

export const validateAndAssign = async (
    {
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
    },
    ci: boolean
): Promise<string> => {
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
            warningMessage: ci && warningMessage ? warning : undefined,
        });
        return answer[name];
    }
};

export const saveProgressIntoProjectConfig = async (data: NewProjectData) => {
    const c = getContext();
    writeFileSync(c.paths.project.config, data.files.project.renativeConfig);
    writeFileSync(c.paths.project.package, data.files.project.packageJson);
};

export const initNewProject = async () => {
    const c = getContext();

    c.paths.project.package = path.join(c.paths.project.dir, RnvFileName.package);
    c.paths.project.config = path.join(c.paths.project.dir, RnvFileName.renative);

    const data: NewProjectData = {
        defaults: {
            appVersion: '0.1.0',
            templateName: '@rnv/template-starter',
            projectName: 'My Renative Project',
            appTitle: 'My Renative App',
            workspaceID: 'rnv',
        },
        inputs: {},
        files: {
            project: {
                renativeConfig: {},
                packageJson: {},
            },
            configTemplates: {},
            template: {
                renativeTemplateConfig: {},
                renativeConfig: {},
            },
        },
    };
    // TODO: This enforces to generate initial runtime configs. find more reliable way to do this
    await updateRenativeConfigs();
    return data;
};

export const configureConfigOverrides = async (data: NewProjectData) => {
    const { inputs, files } = data;
    const { renativeConfig } = files.project;

    const c = getContext();

    const supPlats = inputs.supportedPlatforms || [];

    // In case of copied config instead of extended we want to cleanup unused platforms
    if (renativeConfig.platforms) {
        Object.keys(renativeConfig.platforms).forEach((k) => {
            const key = k as PlatformKey;
            if (!supPlats.includes(key) && renativeConfig.platforms) {
                delete renativeConfig.platforms[key];
            }
        });
    }

    // This is project config override only
    renativeConfig.defaults = renativeConfig.defaults || {};
    renativeConfig.defaults.supportedPlatforms = supPlats;
    renativeConfig.engines = renativeConfig.engines || {};

    // This is merged config result
    const loadedConf = c.files.project.config;

    // Configure only required engines based on supportedPlatforms
    const engines = files.project.renativeConfig?.engines;
    if (engines) {
        // Remove unused engines based on selected platforms
        supPlats.forEach((k) => {
            const selectedEngineId =
                loadedConf?.platforms?.[k]?.engine || c.files.rnvConfigTemplates.config?.platformTemplates?.[k]?.engine;

            if (selectedEngineId) {
                const selectedEngine = findEngineKeyById(selectedEngineId);
                if (selectedEngine?.key && renativeConfig.engines) {
                    renativeConfig.engines[selectedEngine.key] = engines[selectedEngine.key];
                }
            }
        });
    }
    Object.keys(renativeConfig.engines).forEach((engKey) => {
        const engVersion = files.configTemplates.config?.engineTemplates?.[engKey]?.version;
        if (engVersion) {
            if (files.project.packageJson.devDependencies) {
                files.project.packageJson.devDependencies[engKey] = engVersion;
            }
        }
    });
};

export const telemetryNewProject = async (data: NewProjectData) => {
    // Do not log telementry when developing rnv
    if (getContext().paths.IS_LINKED) return;
    try {
        const { inputs } = data;
        getApi().analytics.captureEvent({
            type: 'newProject',
            template: inputs.tepmplate?.packageName,
            platforms: inputs.supportedPlatforms,
        });
    } catch (e) {
        logDebug(e);
    }
};

export const generateProjectOverview = (data: NewProjectData) => {
    const { inputs } = data;

    // const addon = inputs.tepmplate?.localPath ? ` ${chalk().gray(inputs.tepmplate?.localPath)}` : '';
    const tempString = inputs.tepmplate?.localPath || `${inputs.tepmplate?.packageName}@${inputs.tepmplate?.version}`;

    const highlight = chalk().bold;

    const installAddon = !inputs.confirmProjectInstall ? `\n  ${isYarnInstalled() ? 'yarn' : 'npm install'}` : '';

    const str = `  Generated Project Summary:
  -------------------------
  Project Name (--projectName): ${highlight(inputs.projectName)}
  Package name: ${highlight(inputs.packageName)}
  Project Version (--appVersion): ${highlight(inputs.appVersion)}
  Workspace (--workspace): ${highlight(inputs.workspaceID)}
  App Title (--title): ${highlight(inputs.appTitle)}
  App ID (--id): ${highlight(inputs.appID)}
  Project Template (--template): ${highlight(tempString)}
  Git Enabled (--gitEnabled): ${highlight(inputs.confirmEnableGit)}
  Enabled Platforms: ${highlight((inputs.supportedPlatforms || []).join(', '))}
  -------------------------
  ${chalk().green('✔ Your project is ready!')} Run it with:
${chalk().bold(`
  cd ${inputs.projectFolderName}${installAddon}
  npx rnv run`)}`;

    return str;
};

const findEngineKeyById = (id: string) => {
    const c = getContext();
    const engineTemplates = c.files.rnvConfigTemplates.config?.engineTemplates;
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
