// __mocks__/@rnv/core.ts

type Context = {
    program: any;
    process: any;
    cmd: string;
    subCmd: string;
    RNV_HOME_DIR: string;
};

const rnvcore: any = jest.createMockFromModule('@rnv/core');

const configPropMocks = {
    scheme: 'debug',
    bundleAssets: false,
};

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
};
_chalkCols.rgb = () => (v) => v;
_chalkCols.bold = _chalkCols;
const _chalkMono = {
    ..._chalkCols,
};

export const generateRnvConfigPathObj = () => {
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

export const generateContextDefaults = (ctx?: Context) => ({
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
    platform: ctx?.program.platform ?? '',
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
});

rnvcore.getEngineRunnerByPlatform = () => ({
    getOriginalPlatformTemplatesDir: () => 'sometemptdir',
});
rnvcore.executeTask = jest.fn();
rnvcore.shouldSkipTask = () => false;
rnvcore.generatePlatformChoices = () => [];
rnvcore.executeAsync = jest.fn();
rnvcore.removeDirs = jest.fn();
rnvcore.fsExistsSync = () => true;
rnvcore.fsReaddirSync = () => [];
rnvcore.getRealPath = () => '';
rnvcore.copyFolderContentsRecursiveSync = jest.fn();

rnvcore.getConfigProp = (c, platform, key) => configPropMocks[key];
rnvcore.confirmActiveBundler = () => null;
rnvcore.getAppFolder = () => null;

rnvcore.logToSummary = jest.fn();
rnvcore.logTask = jest.fn();
rnvcore.logDebug = jest.fn();
rnvcore.logInfo = jest.fn();
rnvcore.logError = jest.fn();
rnvcore.logWarning = jest.fn();
rnvcore.logSuccess = jest.fn();
rnvcore.logSummary = jest.fn();
rnvcore.chalk = () => _chalkMono;

rnvcore.inquirerPrompt = jest.fn();

rnvcore.createRnvContext = (ctx?: Context) => {
    global.MOCK_RNV_CONTEXT = generateContextDefaults(ctx);
};
rnvcore.getContext = () => {
    return global.MOCK_RNV_CONTEXT;
};

rnvcore.createRnvApi = () => {
    global.MOCK_RNV_API = {
        doResolve: jest.fn(),
        getConfigProp: jest.fn(),
        logger: jest.fn(),
        analytics: {
            captureEvent: () => {
                //NOOP
            },
            captureException() {
                //NOOP
            },
            teardown: async () => {
                //NOOP
            },
        },
        prompt: {
            generateOptions() {
                //NOOP
                return {
                    asString: '',
                    keysAsArray: [],
                    keysAsObject: {},
                    optionsAsArray: [],
                    valuesAsArray: [],
                    valuesAsObject: {},
                };
            },
            inquirerPrompt: async () => {
                return {};
            },
            pressAnyKeyToContinue: async () => {
                return {};
            },
            inquirerSeparator() {
                return {};
            },
        },
        spinner: jest.fn(),
        fsExistsSync: jest.fn(),
        fsReadFileSync: jest.fn(),
        fsReaddirSync: jest.fn(),
        fsWriteFileSync: jest.fn(),
        path: jest.fn(),
    };
};

rnvcore.getApi = () => {
    return global.MOCK_RNV_API;
};

// Common: {
//     getConfigProp: (c, platform, key) => configPropMocks[key],
//     confirmActiveBundler: () => null,
//     getAppFolder: () => null,
// },
// Logger: {
//     logToSummary: jest.fn(),
//     logTask: jest.fn(),
//     logDebug: jest.fn(),
//     logInfo: jest.fn(),
//     logError: jest.fn(),
//     logWarning: jest.fn(),
//     logSuccess: jest.fn(),
//     logSummary: jest.fn(),
//     chalk: () => _chalkMono,
// },
// FileUtils: {
//     fsExistsSync: () => null,
//     copyFileSync: () => null,
// },
// Constants: {
//     PARAMS: {
//         withBase: () => [],
//         withRun: () => [],
//         withConfigure: () => [],
//     },
//     IOS: 'ios',
// },
// TaskManager: {
//     executeTask: () => null,
//     executeOrSkipTask: () => null,
//     shouldSkipTask: () => false,
// },
// Exec: {
//     executeAsync: () => null,
// },
// ObjectUtils: {
//     isObject: () => null,
// },
// PluginManager: {
//     parsePlugins: () => null,
// },
// ProjectManager: {
//     copyAssetsFolder: () => null,
//     copyBuildsFolder: () => null,
//     parseFonts: () => null,
// },
// Resolver: {
//     doResolve: () => null,
//     doResolvePath: () => null,
// },
// Prompt: {
//     isSystemWin: () => null,
// },
// Utils: {
//     inquirerPrompt: () => null,
// },
// PlatformManager: {
//     isPlatformActive: () => null,
//     logErrorPlatform: () => null,
// },
// RuntimeManager: {
//     updateRenativeConfigs: () => null,
// },
// SDKManager: {
//     Apple: {
//         launchAppleSimulator: () => null,
//     },
//     Android: {},
// },

module.exports = rnvcore;
