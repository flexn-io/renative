import { createRnvApi, createRnvContext, executeAsync, executeTask, getContext, removeDirs } from '@rnv/core';
import taskRnvClean from '../tasks/task.rnv.clean';
import taskRnvKill from '../tasks/task.rnv.kill';
import taskRnvPlatformConfigure from '../tasks/task.rnv.platform.configure';
import taskRnvPlatformList from '../tasks/task.rnv.platform.list';

jest.mock('fs');
jest.mock('child_process');
jest.mock('@rnv/core');
jest.mock('inquirer');

const originTask = undefined;

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

test('Execute task.rnv.platform.list', async () => {
    const ctx = getContext();

    await taskRnvPlatformList.fn(ctx, undefined, originTask);
    await expect(taskRnvPlatformList.fn(ctx, undefined, originTask)).resolves.toEqual(true);
    expect(executeTask).toHaveBeenCalledWith(ctx, 'project configure', 'platform list', originTask);
});

test('Execute task.rnv.platform.configure', async () => {
    const ctx = getContext();

    await expect(taskRnvPlatformConfigure.fn(ctx, undefined, originTask)).resolves.toEqual(true);
    expect(executeTask).toHaveBeenCalledWith(ctx, 'project configure', 'platform configure', originTask);
});

test('Execute task.rnv.kill', async () => {
    await expect(taskRnvKill.fn(getContext(), undefined, originTask)).resolves.toEqual(true);
    expect(executeTask).toHaveBeenCalledWith(getContext(), 'app configure', 'kill', originTask);
});

test('Execute task.rnv.clean', async () => {
    //GIVEN
    const ctx = getContext();
    const { inquirerPrompt } = require('@rnv/core');
    inquirerPrompt.mockReturnValue(Promise.resolve({ confirm: true, confirmCache: true }));
    //WHEN
    await expect(taskRnvClean.fn(ctx)).resolves.toEqual(true);
    //THEN
    expect(removeDirs).toHaveBeenCalledTimes(1);
    expect(executeAsync).toHaveBeenCalledWith(ctx, 'watchman watch-del-all');
    expect(executeAsync).toHaveBeenCalledWith(
        ctx,
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
//     jest.doMock('../../src/core/system/utils.ts', () => ({
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
