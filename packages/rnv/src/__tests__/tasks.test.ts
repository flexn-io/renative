/* eslint-disable global-require */

import taskRnvPlatformList from '../../src/engine-core/tasks/task.rnv.platform.list';
import taskRnvKill from '../../src/engine-core/tasks/task.rnv.kill';
import taskRnvPlatformConfigure from '../../src/engine-core/tasks/task.rnv.platform.configure';
import taskRnvClean from '../../src/engine-core/tasks/task.rnv.clean';
// import taskRnvPlatformEject from '../../src/engine-core/tasks/task.rnv.platform.eject';
// import taskRnvPlatformSetup from '../../src/engine-core/tasks/task.rnv.platform.setup';
import { generateMockConfig } from '../../../jest-preset-rnv/mocks';

jest.mock('fs');

jest.mock('inquirer', () => ({
    prompt: () => true,
}));

jest.mock('../../src/core/engineManager/index.js', () => ({
    // getEngineConfigByPlatform: () => ({
    //     platforms: {
    //         ios: {
    //             npm: {}
    //         }
    //     }
    // }),
    getEngineRunnerByPlatform: () => ({
        getOriginalPlatformTemplatesDir: () => 'sometemptdir',
    }),
}));

jest.mock('child_process', () => ({
    spawn: jest.fn(),
}));

jest.mock('../../src/core/taskManager/index.js', () => ({
    executeTask: jest.fn(),
    shouldSkipTask: () => false,
}));

jest.mock('../../src/core/configManager/config.js', () => ({
    getConfig: () => null,
}));

jest.mock('../../src/core/systemManager/utils.js', () => ({
    isSystemWin: false,
}));

jest.mock('../../src/core/systemManager/logger.js', () => {
    const _chalkCols = {
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
    return {
        logToSummary: jest.fn(),
        logTask: jest.fn(),
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logError: jest.fn(),
        logWarning: jest.fn(),
        logSuccess: jest.fn(),
        chalk: () => _chalkMono,
    };
});

jest.mock('../../src/core/systemManager/fileutils.js', () => ({
    removeDirs: jest.fn(),
    fsExistsSync: () => true,
    fsReaddirSync: () => [],
    getRealPath: () => '',
    copyFolderContentsRecursiveSync: jest.fn(),
}));

jest.mock('../../src/core/systemManager/exec.js', () => ({
    executeAsync: jest.fn(),
}));

const c = generateMockConfig({
    buildConfig: {
        sdks: {
            ANDROID_SDK: '',
        },
    },
});

// const parentTask = null;
const originTask = {};

beforeEach(() => {});

afterEach(() => {});

test('Execute task.rnv.platform.list', async () => {
    const taskManager = require('../../src/core/taskManager/index.js');
    await expect(taskRnvPlatformList.fn(c, null, originTask)).resolves.toEqual(true);
    expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});

test('Execute task.rnv.platform.configure', async () => {
    const taskManager = require('../../src/core/taskManager/index.js');
    await expect(taskRnvPlatformConfigure.fn(c, null, originTask)).resolves.toEqual(true);
    expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform configure', originTask);
});

test('Execute task.rnv.kill', async () => {
    const taskManager = require('../../src/core/taskManager/index.js');
    await expect(taskRnvKill.fn(c, null, originTask)).resolves.toEqual(true);
    expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'app configure', 'kill', originTask);
});

test('Execute task.rnv.clean', async () => {
    const configure = generateMockConfig({});
    const systemManager = require('../../src/core/systemManager/exec.js');
    const fileUtils = require('../../src/core/systemManager/fileutils.js');

    await expect(taskRnvClean.fn(configure, true)).resolves.toEqual(true);
    expect(fileUtils.removeDirs).toHaveBeenCalledTimes(3);
    expect(systemManager.executeAsync).toHaveBeenCalledWith(configure, 'watchman watch-del-all');
    expect(systemManager.executeAsync).toHaveBeenCalledWith(
        configure,
        'rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/react-* && rm -rf $TMPDIR/haste-*'
    );
});

// TODO Mocking isSystemWin to true does not work. Need to figure out how to have different values for each test
// test('Execute task.rnv.clean on Windows', async () => {
//     const opts = {
//         detached: false,
//         stdio: 'ignore'
//     };
//     const configure = generateMockConfig({});
//     const child_process = require('child_process');
//     jest.doMock('../../src/core/systemManager/utils.js', () => ({
//         isSystemWin: true
//     }));

//     await expect(taskRnvClean.fn(configure, true)).resolves.toEqual(true);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'del /q/f/s %TEMP%\\*'], opts);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'dotnet nuget locals all --clear'], opts);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'npm cache clean --force & yarn cache clean --all'], opts);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'watchman watch-del-all'], opts);
// });
// describe('Test task.rnv.platform.list', () => {
//     // const MOCK_FILE_INFO = {
//     //     '/path/to/file1.js': 'console.log("file1 contents");',
//     //     '/path/to/file2.txt': 'file2 contents',
//     // };
//     //
//     // beforeEach(() => {
//     //     // Set up some mocked out file info before each test
//     //     require('fs').__setMockFiles(MOCK_FILE_INFO);
//     // });
//
//
//     it('should execute task', async () => {
//         task.fn(c);
//         const engineManager = require('../../core/engineManager/index.js');
//         await expect(task.fn(c, null, originTask)).resolves.toEqual(true);
//         expect(engineManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
//
//         // expect(fileSummary.length).toBe(2);
//     });
// });

// const mocks = {
//     executeTask: jest.fn(),
//     logToSummary: jest.fn()
// };
