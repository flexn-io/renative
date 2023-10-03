import taskRnvRun from '../tasks/task.rnv.run';
import { generateMockConfig } from '../../../jest-preset-rnv/mocks';

jest.mock('fs');
jest.mock('axios');
jest.mock('@rnv/core');

// jest.mock('axios', () => ({
//     get: () => true,
// }));

jest.mock('process', () => ({
    cwd: () => 'mocked value',
}));

jest.mock('@rnv/sdk-webpack', () => ({
    runWebpackServer: () => {
        //Do nothing
    },
}));

// const configPropMocks = {
//     scheme: 'debug',
//     bundleAssets: false,
// };

// jest.mock('rnv', () => {
//     const _chalkCols = {
//         white: (v) => v,
//         green: (v) => v,
//         red: (v) => v,
//         yellow: (v) => v,
//         default: (v) => v,
//         gray: (v) => v,
//         grey: (v) => v,
//         blue: (v) => v,
//         cyan: (v) => v,
//         magenta: (v) => v,
//     };
//     _chalkCols.rgb = () => (v) => v;
//     _chalkCols.bold = _chalkCols;
//     const _chalkMono = {
//         ..._chalkCols,
//     };
//     return {
//         EngineManager: {
//             generateEnvVars: () => ({}),
//         },
//         Common: {
//             getConfigProp: (c, platform, key) => configPropMocks[key],
//             confirmActiveBundler: () => null,
//             getAppFolder: () => null,
//             getDevServerHost: () => '',
//             checkPortInUse: () => false,
//             waitForHost: async () => null,
//             getPlatformBuildDir: () => '',
//             getPlatformServerDir: () => '',
//         },
//         Logger: {
//             logToSummary: jest.fn(),
//             logTask: jest.fn(),
//             logDebug: jest.fn(),
//             logInfo: jest.fn(),
//             logError: jest.fn(),
//             logWarning: jest.fn(),
//             logSuccess: jest.fn(),
//             logSummary: jest.fn(),
//             logRaw: jest.fn(),
//             chalk: () => _chalkMono,
//         },
//         FileUtils: {
//             fsExistsSync: () => null,
//             copyFileSync: () => null,
//         },
//         Constants: {
//             PARAMS: {
//                 withBase: () => [],
//                 withRun: () => [],
//                 withConfigure: () => [],
//             },
//             WEB: 'web',
//             RNV_NODE_MODULES_DIR: '',
//         },
//         TaskManager: {
//             executeTask: () => null,
//             executeOrSkipTask: () => null,
//             shouldSkipTask: () => false,
//         },
//         Exec: {
//             executeAsync: () => null,
//         },
//         ObjectUtils: {
//             isObject: () => null,
//         },
//         PluginManager: {
//             parsePlugins: () => null,
//             getModuleConfigs: () => ({
//                 modulePaths: [],
//                 moduleAliases: {},
//                 moduleAliasesArray: [],
//             }),
//         },
//         ProjectManager: {
//             copyAssetsFolder: () => null,
//             copyBuildsFolder: () => null,
//             parseFonts: () => null,
//         },
//         Resolver: {
//             doResolve: () => null,
//             doResolvePath: () => null,
//         },
//         Prompt: {
//             isSystemWin: () => null,
//         },
//         Utils: {
//             inquirerPrompt: () => null,
//         },
//         PlatformManager: {
//             isPlatformActive: () => null,
//             logErrorPlatform: () => null,
//         },
//         RuntimeManager: {
//             updateRenativeConfigs: () => null,
//         },
//         SDKManager: {
//             Apple: {},
//             Android: {},
//             Webos: {},
//             Tizen: {},
//             Kaios: {},
//         },
//     };
// });

beforeEach(() => {
    //Do nothing
});

afterEach(() => {
    //Do nothing
});

const originTask = {};
const c = generateMockConfig({ platform: 'web' });

test('Execute task.rnv.run', async () => {
    // const taskManager = require('../../src/core/taskManager/index.js');
    await taskRnvRun.fn(c, null, originTask);
    // await expect(taskRnvRun.fn(c, null, originTask)).resolves();
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});
