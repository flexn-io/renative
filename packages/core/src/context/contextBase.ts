import { fsExistsSync, fsReadFileSync, fsReaddirSync, fsWriteFileSync } from '../system/fs';

import path from 'path';
import { RnvContext, RnvContextFileObj, RnvContextPathObj } from './types';

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

export const generateRnvConfigFileObj = (): RnvContextFileObj => {
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

const spinner: any = () => ({
    start: () => {
        //NOOP
    },
});

export const generateConfigBase = (): RnvContext => ({
    analytics: {
        captureEvent: () => {
            //NOOP
        },
    },
    prompt: {
        generateOptions() {
            //NOOP
        },
        inquirerPrompt: async () => {
            //NOOP
        },
        pressAnyKeyToContinue: async () => {
            //NOOP
        },
    },
    spinner: spinner,
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
    platform: '',
    process: {},
    //==========
    _renativePluginCache: {},
    cli: {},
    api: {
        fsExistsSync,
        fsReadFileSync,
        fsReaddirSync,
        fsWriteFileSync,
        path,
    },
    configPropsInjects: {},
    runtime,
    paths: {
        CURRENT_DIR: '',
        IS_LINKED: false,
        RNV_HOME_DIR: '',
        RNV_NODE_MODULES_DIR: '',
        appConfigBase: '',
        GLOBAL_RNV_CONFIG: '',
        rnv: {
            configWorkspaces: {},
            dir: '',
            package: '',
            pluginTemplates: {
                configs: {},
                dirs: {},
            },
            platformTemplates: {},
            projectTemplates: {},
            platformTemplate: {},
            plugins: {},
            engines: {},
            projectTemplate: {},
        },
        workspace: {
            ...generateRnvConfigPathObj(),
            project: {
                ...generateRnvConfigPathObj(),
                appConfigBase: {},
                builds: {},
                assets: {},
                platformTemplates: {},
                appConfigsDirs: [],
                appConfigsDirNames: [],
            },
            appConfig: {
                ...generateRnvConfigPathObj(),
            },
        },
        defaultWorkspace: {
            ...generateRnvConfigPathObj(),
            project: {
                appConfigBase: {},
                builds: {},
                assets: {},
                platformTemplates: {},
                appConfigsDirs: [],
                appConfigsDirNames: [],
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
            appConfigBase: {},
            builds: {},
            assets: {},
            platformTemplates: {},
            appConfigsDirs: [],
            appConfigsDirNames: [],
            dir: '',
            platformTemplatesDirs: {},
            nodeModulesDir: '',
        },
        appConfig: {
            ...generateRnvConfigPathObj(),
        },
        // EXTRA
        GLOBAL_RNV_DIR: '',
        buildHooks: {
            dist: {},
            dir: '',
            index: '',
        },
        home: {},
        template: {
            ...generateRnvConfigPathObj(),
            configTemplate: '',
            appConfigBase: {},
            builds: {},
            assets: {},
            platformTemplates: {},
        },
    },
    files: {
        rnv: {
            pluginTemplates: {},
            platformTemplates: {},
            projectTemplates: {},
            platformTemplate: {},
            plugins: {},
            engines: {},
            projectTemplate: {},
            configWorkspaces: {},
            package: {},
        },
        workspace: {
            ...generateRnvConfigFileObj(),
            project: {
                ...generateRnvConfigFileObj(),
                configs: [],
                appConfigBase: {},
                builds: {},
                assets: {},
                platformTemplates: {},
            },
            appConfig: {
                ...generateRnvConfigFileObj(),
            },
        },
        defaultWorkspace: {
            ...generateRnvConfigPathObj(),
            project: {
                ...generateRnvConfigPathObj(),
                appConfigBase: {},
                builds: {},
                assets: {},
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
