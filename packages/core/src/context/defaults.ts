import type { RnvContext, RnvContextPathObj } from './types';

export const generateRnvConfigPathObj = (): RnvContextPathObj => {
    return {
        configs: [],
        configsPrivate: [],
        configsLocal: [],
        appConfigsDir: '',
        config: '',
        configLocal: '',
        configPrivate: '',
        dir: '',
        dirs: [],
        fontsDir: '',
        fontsDirs: [],
        pluginDirs: [],
    };
};

export const generateRnvConfigFileObj = () => {
    return {
        configs: [],
        configsLocal: [],
        configsPrivate: [],
    };
};

const runtime: any = {
    enginesByPlatform: {},
    enginesByIndex: [],
    enginesById: {},
};

export const generateContextDefaults = (): RnvContext => ({
    isDefault: true,
    isSystemWin: false,
    logMessages: [],
    timeEnd: new Date(),
    timeStart: new Date(),
    payload: {},
    assetConfig: {},
    rnvVersion: '',
    buildHooks: {},
    buildPipes: {},
    isBuildHooksReady: false,
    runtimePropsInjects: [],
    supportedPlatforms: [],
    systemPropsInjects: [],
    program: {},
    buildConfig: {},
    command: '',
    subCommand: '',
    platform: null,
    process: {},
    //==========
    _renativePluginCache: {},
    cli: {},
    configPropsInjects: [],
    injectableConfigProps: {},
    runtime,
    paths: {
        CURRENT_DIR: '',
        IS_LINKED: false,
        IS_NPX_MODE: false,
        RNV_HOME_DIR: '',
        RNV_NODE_MODULES_DIR: '',
        appConfigBase: '',
        GLOBAL_RNV_CONFIG: '',
        rnv: {
            configWorkspaces: '',
            dir: '',
            package: '',
            pluginTemplates: {
                dirs: {},
            },
            projectTemplates: {
                config: '',
                dir: '',
            },
            engines: {
                dir: '',
            },
            projectTemplate: { dir: '' },
        },
        workspace: {
            ...generateRnvConfigPathObj(),
            project: {
                ...generateRnvConfigPathObj(),
                appConfigBase: {
                    dir: '',
                },
                builds: '',
                assets: '',
            },
            appConfig: {
                ...generateRnvConfigPathObj(),
            },
        },
        defaultWorkspace: {
            ...generateRnvConfigPathObj(),
            project: {
                appConfigBase: {
                    dir: '',
                },
                builds: {
                    dir: '',
                },
                assets: {
                    dir: '',
                },
            },
            appConfig: {
                configs: [],
                configsPrivate: [],
                configsLocal: [],
            },
        },
        project: {
            ...generateRnvConfigPathObj(),
            config: '',
            appConfigBase: {
                dir: '',
                fontsDir: '',
                fontsDirs: [],
                pluginsDir: '',
            },
            builds: {
                dir: '',
                config: '',
            },
            assets: {
                dir: '',
                config: '',
                runtimeDir: '',
            },
            appConfigsDirs: [],
            appConfigsDirNames: [],
            dir: '',
            platformTemplatesDirs: {},
            nodeModulesDir: '',
        },
        appConfig: {
            ...generateRnvConfigPathObj(),
        },
        GLOBAL_RNV_DIR: '',
        buildHooks: {
            dist: {
                dir: '',
                index: '',
            },
            dir: '',
            index: '',
        },
        home: {
            dir: '',
        },
        template: {
            configTemplate: '',
            appConfigBase: {
                dir: '',
            },
            builds: {
                dir: '',
            },
            assets: {
                dir: '',
            },
            appConfigsDir: '',
            config: '',
            dir: '',
        },
    },
    files: {
        rnv: {
            pluginTemplates: {
                configs: {},
            },
            projectTemplates: {},
            package: {},
        },
        workspace: {
            ...generateRnvConfigFileObj(),
            project: {
                ...generateRnvConfigFileObj(),
                configs: [],
                appConfigBase: {},
                platformTemplates: {},
            },
            appConfig: {
                ...generateRnvConfigFileObj(),
            },
        },
        defaultWorkspace: {
            ...generateRnvConfigFileObj(),
            project: {
                ...generateRnvConfigFileObj(),
                appConfigBase: {},
                platformTemplates: {},
            },
            appConfig: {
                configs: [],
                configsPrivate: [],
                configsLocal: [],
            },
        },
        project: {
            ...generateRnvConfigFileObj(),
            appConfigBase: {},
            builds: {},
            assets: {},
            platformTemplates: {},
            package: {},
        },
        appConfig: {
            ...generateRnvConfigFileObj(),
        },
    },
});
