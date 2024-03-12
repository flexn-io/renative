import {
    ConfigFileProject,
    ConfigName,
    PlatformKey,
    chalk,
    getApi,
    getContext,
    getWorkspaceOptions,
    logDebug,
    logTask,
    writeFileSync,
} from '@rnv/core';
import path from 'path';
import { NewProjectData } from './types';
import { configureGit } from './questions/confirmGit';

export const initNewProject = async () => {
    const c = getContext();

    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.config = path.join(c.paths.project.dir, ConfigName.renative);

    const data: NewProjectData = {
        defaultVersion: '0.1.0',
        defaultTemplate: '@rnv/template-starter',
        defaultProjectName: 'helloRenative',
        defaultAppTitle: 'Hello Renative',
        defaultWorkspace: 'rnv',
        optionPlatforms: {},
        optionTemplates: {},
        optionWorkspaces: getWorkspaceOptions(),
    };
    return data;
};

export const generateNewProject = async (data: NewProjectData) => {
    logTask(
        `generateNewProject:${data.optionTemplates.selectedOption}:${data.optionTemplates.selectedVersion}`,
        chalk().grey
    );

    if (!data.optionTemplates.selectedVersion) {
        return Promise.reject('No template version selected');
    }
    if (!data.renativeTemplateConfig) {
        return Promise.reject('No renativeTemplateConfig found');
    }
    if (!data.optionTemplates.selectedOption) {
        return Promise.reject('Current template not selected!');
    }

    const c = getContext();
    const templates: Record<string, { version: string }> = {};

    if (data.optionTemplates.selectedOption) {
        templates[data.optionTemplates.selectedOption] = {
            version: data.optionTemplates.selectedVersion,
        };
    }

    delete data.renativeTemplateConfig.templateConfig;
    delete data.renativeTemplateConfig.bootstrapConfig;

    const config: ConfigFileProject = {
        platforms: {},
        ...data.renativeTemplateConfig,
        ...data.renativeTemplateConfigExt,
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

    const tplEngines = data.renativeTemplateConfig.engines;
    if (tplEngines) {
        // Remove unused engines based on selected platforms
        supPlats.forEach((k) => {
            const selectedEngineId =
                platforms[k]?.engine || c.files.rnv.projectTemplates.config?.platformTemplates?.[k]?.engine;
            if (selectedEngineId) {
                const selectedEngine = findEngineKeyById(selectedEngineId);
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
        await configureGit();
    }
};

export const telemetryNewProject = async (data: NewProjectData) => {
    try {
        await getApi().analytics.captureEvent({
            type: 'newProject',
            template: data.selectedInputTemplate,
            platforms: data.inputSupportedPlatforms,
        });
    } catch (e) {
        logDebug(e);
    }
};

const findEngineKeyById = (id: string) => {
    const c = getContext();
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
