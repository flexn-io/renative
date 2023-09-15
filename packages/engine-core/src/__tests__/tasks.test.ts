/* eslint-disable global-require */

import taskRnvPlatformList from '../tasks/task.rnv.platform.list';
import taskRnvKill from '../tasks/task.rnv.kill';
import taskRnvPlatformConfigure from '../tasks/task.rnv.platform.configure';
import taskRnvClean from '../tasks/task.rnv.clean';
// import taskRnvPlatformEject from '../../src/engine-core/tasks/task.rnv.platform.eject';
// import taskRnvPlatformSetup from '../../src/engine-core/tasks/task.rnv.platform.setup';
import { generateMockConfig } from '../../../jest-preset-rnv/mocks';

jest.mock('fs');
jest.mock('child_process');
jest.mock('rnv');

jest.mock('inquirer', () => ({
    prompt: () => true,
}));

// jest.mock('../../src/core/engineManager/index.ts', () => ({
//     // getEngineConfigByPlatform: () => ({
//     //     platforms: {
//     //         ios: {
//     //             npm: {}
//     //         }
//     //     }
//     // }),
//     getEngineRunnerByPlatform: () => ({
//         getOriginalPlatformTemplatesDir: () => 'sometemptdir',
//     }),
// }));

// jest.mock('../../src/core/systemManager/utils.ts', () => ({
//     isSystemWin: false,
// }));

// jest.mock('../../src/core/systemManager/logger.ts');

const c = generateMockConfig({
    buildConfig: {
        sdks: {
            ANDROID_SDK: '',
        },
    },
});

// const parentTask = null;
const originTask = undefined;

const { executeTask, executeAsync, removeDirs } = require('rnv');

beforeEach(() => {
    //Do nothing
});

afterEach(() => {
    //Do nothing
});

test('Execute task.rnv.platform.list', async () => {
    await taskRnvPlatformList.fn(c, undefined, originTask);
    await expect(taskRnvPlatformList.fn(c, undefined, originTask)).resolves.toEqual(true);
    expect(executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});

test('Execute task.rnv.platform.configure', async () => {
    await expect(taskRnvPlatformConfigure.fn(c, undefined, originTask)).resolves.toEqual(true);
    expect(executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform configure', originTask);
});

test('Execute task.rnv.kill', async () => {
    await expect(taskRnvKill.fn(c, undefined, originTask)).resolves.toEqual(true);
    expect(executeTask).toHaveBeenCalledWith(c, 'app configure', 'kill', originTask);
});

test('Execute task.rnv.clean', async () => {
    const configure = generateMockConfig({ program: { ci: true } });

    await expect(taskRnvClean.fn(configure)).resolves.toEqual(true);
    expect(removeDirs).toHaveBeenCalledTimes(3);
    expect(executeAsync).toHaveBeenCalledWith(configure, 'watchman watch-del-all');
    expect(executeAsync).toHaveBeenCalledWith(
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
//     jest.doMock('../../src/core/systemManager/utils.ts', () => ({
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
//     //     '/path/to/file1.ts': 'console.log("file1 contents");',
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
//         const engineManager = require('../../core/engineManager/index.ts');
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
