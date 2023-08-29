import { fsExistsSync, fsReadFileSync, fsReaddirSync, fsWriteFileSync } from '../systemManager/fileutils';

import path from 'path';
import { RnvConfig } from './types';

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
            pluginTemplates: {
                configs: {},
            },
            platformTemplates: {},
            projectTemplates: {},
            platformTemplate: {},
            plugins: {},
            engines: {},
            projectTemplate: {},
        },
        workspace: {
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
        defaultWorkspace: {
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
            config: '',
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
        // EXTRA
        GLOBAL_RNV_DIR: '',
        buildHooks: {
            dist: {},
        },
        home: {},
        template: {
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
            project: {
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
        defaultWorkspace: {
            project: {
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
});
