import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import taskRnvRun from '../tasks/task.rnv.run';
import taskRnvStart from '../tasks/task.rnv.start';

jest.mock('fs');
jest.mock('axios');
jest.mock('@rnv/core');
jest.mock('@rnv/sdk-apple');

beforeEach(() => {
    createRnvContext({ program: { platform: 'tvos' } });
    createRnvApi();
});

afterEach(() => {
    //Do nothing
});

const originTask = undefined;

const { executeAsync, logError } = require('@rnv/core');

test('Execute task.rnv.run', async () => {
    // GIVEN
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    // WHEN
    await taskRnvRun.fn(ctx, undefined, originTask);
    // THEN
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});

test('Execute task.rnv.start with no parent', async () => {
    // GIVEN
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    // WHEN
    await taskRnvStart.fn(ctx, undefined, originTask);
    // THEN
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
});

test('Execute task.rnv.start', async () => {
    // GIVEN
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    // WHEN
    await taskRnvStart.fn(ctx, 'parent', originTask);
    // THEN
    expect(executeAsync).toHaveBeenCalledWith(ctx, 'node undefined/local-cli/cli.js start --port undefined --config=metro.config.js', { env: {}, silent: true, stdio: 'inherit' });
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
});

test('Execute task.rnv.start with metro failure', async () => {
    // GIVEN
    const ctx = getContext();
    executeAsync.mockReturnValue(new Promise((resolve, reject) => reject('Metro failed')));
    // WHEN
    await taskRnvStart.fn(ctx, 'parent', originTask);
    // THEN
    expect(executeAsync).toHaveBeenCalledWith(ctx, 'node undefined/local-cli/cli.js start --port undefined --config=metro.config.js', { env: {}, silent: true, stdio: 'inherit' });
    expect(logError).toHaveBeenCalledWith('Metro failed', true);
    await expect(taskRnvRun.fn(ctx, undefined, originTask)).resolves.toEqual(true);
});