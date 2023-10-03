// __mocks__/@rnv/core.ts
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
