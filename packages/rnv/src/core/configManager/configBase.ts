import { fsExistsSync, fsReadFileSync, fsReaddirSync, fsWriteFileSync } from '../systemManager/fileutils';

import path from 'path';
import { RnvConfig, RnvConfigFileObj, RnvConfigPathObj } from './types';

const generateRnvConfigPathObj = (): RnvConfigPathObj => {
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

const generateRnvConfigFileObj = (): RnvConfigFileObj => {
    return {
        configs: [],
        configsLocal: [],
        configsPrivate: [],
    };
};

export const generateConfigBase = (): RnvConfig => ({
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
    runtime: {
        enginesByPlatform: {},
        enginesByIndex: [],
        enginesById: {},
    },
    paths: {
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
        },
        appConfig: {
            ...generateRnvConfigFileObj(),
        },
    },
});
