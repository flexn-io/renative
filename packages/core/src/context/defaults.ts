// import path from 'path';
import type { RnvContext, RnvContextPathObj } from './types';

// export const USER_HOME_DIR = homedir();

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
    requiresBootstrap: false,
    port: 3000,
    runtimeExtraProps: {},
};

export const generateContextDefaults = (): RnvContext => ({
    isDefault: true,
    isSystemWin: false,
    logging: {
        logMessages: [],
        containsError: false,
        containsWarning: false,
    },
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
        outputHelp: () => {
            //NOOP
        },
        allowUnknownOption() {
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
        IS_LINKED: false,
        IS_NPX_MODE: false,
        appConfigBase: '',
        user: {
            currentDir: '',
            homeDir: '',
        },
        rnv: {
            dir: '',
            package: '',
        },
        scopedConfigTemplates: {
            configs: {},
            pluginTemplatesDirs: {},
        },
        rnvCore: {
            dir: '',
            templateFilesDir: '',
            package: '',
        },
        rnvConfigTemplates: {
            config: '',
            dir: '',
            package: '',
            pluginTemplatesDir: '',
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
        dotRnv: {
            dir: '',
            config: '',
            configWorkspaces: '',
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
            package: {},
        },
        dotRnv: {
            configWorkspaces: {
                workspaces: {},
            },
            config: {},
        },
        rnvCore: {
            package: {},
        },
        rnvConfigTemplates: {
            config: {},
            package: {},
        },
        scopedConfigTemplates: {},
        workspace: {
            ...generateRnvConfigFileObj(),
            project: {
                ...generateRnvConfigFileObj(),
            },
            appConfig: {
                ...generateRnvConfigFileObj(),
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
