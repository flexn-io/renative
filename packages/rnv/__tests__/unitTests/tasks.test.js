/* eslint-disable global-require */

import taskRnvPlatformList from '../../src/engine-core/tasks/task.rnv.platform.list';
import taskRnvPlatformConfigure from '../../src/engine-core/tasks/task.rnv.platform.configure';
// import taskRnvPlatformEject from '../../src/engine-core/tasks/task.rnv.platform.eject';
// import taskRnvPlatformSetup from '../../src/engine-core/tasks/task.rnv.platform.setup';
import { generateConfig } from '../../../jest-preset-rnv/mocks';


jest.mock('fs');

jest.mock('../../src/core/engineManager/index.js', () => ({
    // getEngineConfigByPlatform: () => ({
    //     platforms: {
    //         ios: {
    //             npm: {}
    //         }
    //     }
    // }),
    getEngineRunnerByPlatform: () => ({
        getOriginalPlatformTemplatesDir: () => 'sometemptdir'
    })
}));

jest.mock('../../src/core/taskManager/index.js', () => ({
    executeTask: jest.fn()
}));

jest.mock('../../src/core/configManager/config.js', () => ({
    getConfig: () => null
}));

jest.mock('../../src/core/systemManager/logger.js', () => {
    const _chalkCols = {
        white: v => v,
        green: v => v,
        red: v => v,
        yellow: v => v,
        default: v => v,
        gray: v => v,
        grey: v => v,
        blue: v => v,
        cyan: v => v,
        magenta: v => v
    };
    _chalkCols.rgb = () => v => v;
    _chalkCols.bold = _chalkCols;
    const _chalkMono = {
        ..._chalkCols
    };
    return {
        logToSummary: jest.fn(),
        logTask: jest.fn(),
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logError: jest.fn(),
        logWarning: jest.fn(),
        logSuccess: jest.fn(),
        chalk: () => _chalkMono
    };
});

const c = generateConfig({});

// const parentTask = null;
const originTask = {};

beforeEach(() => {
});

afterEach(() => {

});

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
