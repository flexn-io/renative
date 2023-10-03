import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import taskRnvRun from '../tasks/task.rnv.run';

jest.mock('fs');
jest.mock('axios');
jest.mock('@rnv/core');

jest.mock('process', () => ({
    cwd: () => 'mocked value',
}));

jest.mock('@rnv/sdk-webpack', () => ({
    runWebpackServer: () => {
        //Do nothing
    },
}));

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    //Do nothing
});

const originTask = {};
// const c = generateMockConfig({ platform: 'web' });

test('Execute task.rnv.run', async () => {
    // const taskManager = require('../../src/core/taskManager/index.js');
    const ctx = getContext();
    await taskRnvRun.fn(ctx, null, originTask);
    // await expect(taskRnvRun.fn(c, null, originTask)).resolves();
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});
