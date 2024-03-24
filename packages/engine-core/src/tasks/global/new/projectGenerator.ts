import {
    PlatformKey,
    RnvFileName,
    applyTemplate,
    chalk,
    configureTemplateFiles,
    generateLocalJsonSchemas,
    getApi,
    getContext,
    logDebug,
    logToSummary,
    updateRenativeConfigs,
    writeFileSync,
} from '@rnv/core';
import path from 'path';
import { NewProjectData } from './types';

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
            projectName: 'helloRenative',
            appTitle: 'Hello Renative',
            workspaceID: 'rnv',
        },
        inputs: {},
        files: {
            project: {
                renativeConfig: {},
                packageJson: {},
                renativeAppConfig: {},
            },
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

export const generateNewProject = async (data: NewProjectData) => {
    // logTask(
    //     `generateNewProject:${data.optionTemplates.selectedOption}:${data.optionTemplates.selectedVersion}`,
    //     chalk().grey
    // );
    const { inputs, files } = data;

    if (!inputs.tepmplate?.version) {
        return Promise.reject('No template version selected');
    }
    if (!files.template.renativeTemplateConfig) {
        return Promise.reject('No renativeTemplateConfig found');
    }
    if (!inputs.tepmplate.packageName) {
        return Promise.reject('Current template not selected!');
    }

    const c = getContext();

    //TODO: TEMPORARY WORKAROUND this neds to use bootstrap_metadata to work properly
    //     common: {
    //         id: data.inputAppID || 'com.mycompany.myapp',
    //         title: data.inputAppTitle || 'My App',
    //     },

    const supPlats = inputs.supportedPlatforms || [];

    // This is project config override only
    const cnf = files.project.renativeConfig;
    cnf.defaults = cnf.defaults || {};
    cnf.defaults.supportedPlatforms = supPlats;
    cnf.engines = cnf.engines || {};

    // This is merged config result
    const loadedConf = c.files.project.config;

    // Configure only required engines based on supportedPlatforms
    const engines = loadedConf?.engines;
    if (engines) {
        // Remove unused engines based on selected platforms
        supPlats.forEach((k) => {
            const selectedEngineId =
                loadedConf?.platforms?.[k]?.engine || c.files.rnvConfigTemplates.config?.platformTemplates?.[k]?.engine;

            if (selectedEngineId) {
                const selectedEngine = findEngineKeyById(selectedEngineId);
                if (selectedEngine?.key && cnf.engines) {
                    cnf.engines[selectedEngine.key] = engines[selectedEngine.key];
                }
            }
        });
    }

    // In case of copied config instead of extended we want to cleanup unused platforms
    if (cnf.platforms) {
        Object.keys(cnf.platforms).forEach((k) => {
            const key = k as PlatformKey;
            if (!supPlats.includes(key) && cnf.platforms) {
                delete cnf.platforms[key];
            }
        });
    }

    // Save all progress into ./renative.json
    await saveProgressIntoProjectConfig(data);

    // Now we can apply template
    await applyTemplate();
    await configureTemplateFiles();
    await generateLocalJsonSchemas();

    logToSummary(generateProjectOverview(data));
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

    const str = `  Generated Project Summary:
  -------------------------
  Project Name (folder): ${highlight(inputs.projectName)}
  Workspace: ${highlight(inputs.workspaceID)}
  App Title: ${highlight(inputs.appTitle)}
  App Version: ${highlight(inputs.appVersion)}
  App ID: ${highlight(inputs.appID)}
  Project Template: ${highlight(tempString)}
  Git Enabled: ${highlight(inputs.confirmEnableGit)}
  Enabled Platforms: ${highlight((inputs.supportedPlatforms || []).join(', '))}
  -------------------------
  ${chalk().green('✔ Your project is ready!')} Run it with:
${chalk().bold(`
  cd ${inputs.projectName}
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
