import path from 'path';
import type { RnvContext, RnvContextPathObj } from './types';

import { homedir } from 'os';

export const USER_HOME_DIR = homedir();

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

const runtime: RnvContext['runtime'] = {
    plugins: {},
    pluginVersions: {},
    enginesByPlatform: {},
    missingEnginePlugins: {},
    enginesByIndex: [],
    enginesById: {},
    supportedPlatforms: [],
    availablePlatforms: [],
    platform: null,
    _skipNativeDepResolutions: false,
    _skipPluginScopeWarnings: false,
    bundleAssets: false,
    disableReset: false,
    hosted: false,
    hasAllEnginesRegistered: false,
    isTargetTrue: false,
    isWSConfirmed: false,
    skipBuildHooks: false,
    skipActiveServerCheck: false,
    versionCheckCompleted: false,
    requiresForcedTemplateApply: false,
    forceBuildHookRebuild: false,
    keepSessionActive: false,
    requiresBootstrap: false,
    port: 3000,
    runtimeExtraProps: {},
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
    program: {
        args: [],
        rawArgs: [],
        option: () => {
            //NOOP
        },
        parse: () => {
            //NOOP
        },
    },
    buildConfig: {},
    command: '',
    subCommand: '',
    platform: null,
    process: process,
    runningProcesses: [],
    //==========
    _renativePluginCache: {},
    cli: {},
    configPropsInjects: [],
    injectableConfigProps: {},
    runtime,
    paths: {
        RNV_CORE_HOME_DIR: path.join(__dirname, '../..'),
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
            dotRnvDir: '',
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
            src: {
                dir: '',
                index: '',
                indexTs: '',
            },
            tsconfig: '',
            dir: '',
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
            },
            appConfig: {
                ...generateRnvConfigFileObj(),
            },
        },
        defaultWorkspace: {
            ...generateRnvConfigFileObj(),
            project: {
                ...generateRnvConfigFileObj(),
            },
            appConfig: {
                configs: [],
                configsPrivate: [],
                configsLocal: [],
            },
        },
        project: {
            ...generateRnvConfigFileObj(),
            builds: {},
            assets: {},
            package: {},
        },
        appConfig: {
            ...generateRnvConfigFileObj(),
        },
    },
});
