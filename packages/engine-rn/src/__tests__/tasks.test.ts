import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import taskRnvRun from '../tasks/task.rnv.run';
import taskRnvStart from '../tasks/task.rnv.start';

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

const { executeAsync, logError } = require('@rnv/core');

test('Execute task.rnv.run', async () => {
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    await taskRnvRun.fn(ctx, undefined, originTask);
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});

test('Execute task.rnv.start with no parent', async () => {
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    await taskRnvStart.fn(ctx, undefined, originTask);
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
});

test('Execute task.rnv.start', async () => {
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    await taskRnvStart.fn(ctx, 'parent', originTask);
    expect(executeAsync).toHaveBeenCalledWith(ctx, 'npx react-native start --port undefined --no-interactive', { env: {}, silent: true, stdio: 'inherit' });
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
});

test('Execute task.rnv.start with metro failure', async () => {
    const ctx = getContext();
    executeAsync.mockReturnValue(new Promise((resolve, reject) => reject('Metro failed')));
    await taskRnvStart.fn(ctx, 'parent', originTask);
    expect(executeAsync).toHaveBeenCalledWith(ctx, 'npx react-native start --port undefined --no-interactive', { env: {}, silent: true, stdio: 'inherit' });
    expect(logError).toHaveBeenCalledWith('Metro failed', true);
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
});