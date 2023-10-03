import { getContext } from '@rnv/core';
import taskRnvRun from '../tasks/task.rnv.run';

jest.mock('fs');
jest.mock('axios');
// jest.mock('@rnv/core');
jest.mock('@rnv/sdk-apple');

beforeEach(() => {
    //Do nothing
});

afterEach(() => {
    //Do nothing
});

const originTask = undefined;

const { executeAsync } = require('@rnv/core');

test('Execute task.rnv.run', async () => {
    // const taskManager = require('../../src/core/taskManager/index.js');
    // await taskRnvRun.fn(c, null, originTask);
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    await taskRnvRun.fn(getContext(), undefined, originTask);
    await expect(taskRnvRun.fn(getContext(), undefined, originTask)).resolves.toEqual(true);
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});
