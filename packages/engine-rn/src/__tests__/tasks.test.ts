import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import taskRnvRun from '../tasks/task.rnv.run';

jest.mock('fs');
jest.mock('axios');
jest.mock('@rnv/core');
jest.mock('@rnv/sdk-apple');

beforeEach(() => {
    createRnvContext({ program: { platform: 'ios' } });
    createRnvApi();
});

afterEach(() => {
    //Do nothing
});

const originTask = undefined;

const { executeAsync } = require('@rnv/core');

test('Execute task.rnv.run', async () => {
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    await taskRnvRun.fn(ctx, undefined, originTask);
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});
