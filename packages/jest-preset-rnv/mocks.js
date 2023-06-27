// TODO: convert to proper jest preset
const merge = require('deepmerge');

const DEFAULT_C = {
    runtime: {
        appId: 'testapp',
        availablePlatforms: ['ios', 'web'],
        supportedPlatforms: [
            {
                engine: 'engine-rn',
                platform: 'ios',
                isConnected: true,
                port: '0000',
                isValid: true,
            },
        ],
        target: '',
    },
    platform: 'ios',
    program: {
        ci: false,
    },
    buildConfig: {
        platforms: {
            ios: {},
        },
        defaults: {
            supportedPlatforms: ['ios'],
        },
    },
    paths: {
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
            appConfigBase: {},
            dir: '',
            builds: {
                dir: '',
            },
            platformTemplatesDirs: {
                ios: '',
            },
            assets: {
                dir: '',
            },
            platformTemplates: {},
            appConfigsDirs: [],
            appConfigsDirNames: [],
            configExists: true,
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
};

module.exports = {
    generateMockConfig: (cOverride = {}) => merge(DEFAULT_C, cOverride),
};
