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
    const result = await taskRnvRun.fn(ctx, undefined, originTask);
    // THEN
    expect(result).toEqual(true);
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});

test('Execute task.rnv.start with no parent', async () => {
    // GIVEN
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    // WHEN
    const result = await taskRnvStart.fn(ctx, undefined, originTask);
    // THEN
    expect(result).toEqual(true);
});

test('Execute task.rnv.start', async () => {
    // GIVEN
    const ctx = getContext();
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    // WHEN
    const result = await taskRnvStart.fn(ctx, 'parent', originTask);
    // THEN
    expect(executeAsync).toHaveBeenCalledWith(
        ctx,
        'node undefined/local-cli/cli.js start --port undefined --no-interactive --config=metro.config.js',
        {
            env: {},
            silent: true,
            stdio: 'inherit',
            printableEnvKeys: [
                'RNV_REACT_NATIVE_PATH',
                'RNV_APP_ID',
                'RNV_PROJECT_ROOT',
                'RNV_APP_BUILD_DIR',
                'RNV_ENGINE_PATH',
            ],
        }
    );
    expect(result).toEqual(true);
});

test('Execute task.rnv.start with metro failure', async () => {
    // GIVEN
    const ctx = getContext();
    executeAsync.mockReturnValue(new Promise((resolve, reject) => reject('Metro failed')));
    // WHEN
    const result = await taskRnvStart.fn(ctx, 'parent', originTask);
    // THEN
    expect(executeAsync).toHaveBeenCalledWith(
        ctx,
        'node undefined/local-cli/cli.js start --port undefined --no-interactive --config=metro.config.js',
        {
            env: {},
            silent: true,
            stdio: 'inherit',
            printableEnvKeys: [
                'RNV_REACT_NATIVE_PATH',
                'RNV_APP_ID',
                'RNV_PROJECT_ROOT',
                'RNV_APP_BUILD_DIR',
                'RNV_ENGINE_PATH',
            ],
        }
    );
    expect(logError).toHaveBeenCalledWith('Metro failed', true);
    expect(result).toEqual(true);
});
