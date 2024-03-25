// __mocks__/@rnv/core.ts

type Context = {
    program: any;
    process: any;
    cmd: string;
    subCmd: string;
    RNV_HOME_DIR: string;
};

const rnvcore: any = jest.createMockFromModule('@rnv/core');

const _chalkCols: any = {
    white: (v) => v,
    green: (v) => v,
    red: (v) => v,
    yellow: (v) => v,
    default: (v) => v,
    gray: (v) => v,
    grey: (v) => v,
    blue: (v) => v,
    cyan: (v) => v,
    magenta: (v) => v,
    bold: (v) => v,
    rgb: (v) => v,
};
function mockChalk() {
    return _chalkCols;
}
Object.assign(mockChalk, _chalkCols);
Object.keys(_chalkCols).forEach((key) => {
    _chalkCols[key] = mockChalk;
});
const _chalkMono = {
    ..._chalkCols,
};

const generateRnvConfigPathObj = () => {
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

const generateRnvConfigFileObj = () => {
    return {
        configs: [],
        configsLocal: [],
        configsPrivate: [],
    };
};

const generateContextDefaults = (ctx?: Context) => {
    const runtime: any = {
        currentEngine: { rootPath: '' },
        enginesByPlatform: {},
        enginesByIndex: [],
        enginesById: {},
        supportedPlatforms: [
            'ios',
            'android',
            'androidtv',
            'firetv',
            'androidwear',
            'web',
            'webtv',
            'tizen',
            'tvos',
            'webos',
            'macos',
            'windows',
            'tizenwatch',
            'tizenmobile',
            'kaios',
            'chromecast',
        ],
    };
    return {
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
        platform: ctx?.program.opts().platform ?? '',
        process: {},
        //==========
        _renativePluginCache: {},
        cli: {},
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
    };
};
rnvcore.chalk = () => _chalkMono;
rnvcore.createRnvContext = (ctx?: Context) => {
    rnvcore.__MOCK_RNV_CONTEXT = generateContextDefaults(ctx);
};
rnvcore.getContext = () => rnvcore.__MOCK_RNV_CONTEXT;

module.exports = rnvcore;
