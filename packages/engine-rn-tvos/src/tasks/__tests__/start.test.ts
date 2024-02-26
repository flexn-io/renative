import { createRnvApi, createRnvContext, getContext, logError, doResolve, executeTask } from '@rnv/core';
import taskRnvStart from '../task.rnv.start';
import { startReactNative } from '@rnv/sdk-react-native';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-react-native');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

const originTask = undefined;

test('Execute task.rnv.start with no parent', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'tvos';
    jest.mocked(doResolve).mockReturnValueOnce('MOCKED_PATH');
    // WHEN
    await taskRnvStart.fn?.(ctx, undefined, originTask);
    // THEN
    expect(executeTask).toHaveBeenCalledTimes(1);
    expect(startReactNative).toHaveBeenCalledWith(ctx, {
        waitForBundler: true,
        customCliPath: 'MOCKED_PATH/local-cli/cli.js',
        metroConfigName: 'metro.config.js',
    });
});

test('Execute task.rnv.start', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'tvos';
    jest.mocked(doResolve).mockReturnValueOnce('MOCKED_PATH');
    // WHEN
    await taskRnvStart.fn?.(ctx, 'parent', originTask);
    // THEN
    expect(startReactNative).toHaveBeenCalledWith(ctx, {
        waitForBundler: false,
        customCliPath: 'MOCKED_PATH/local-cli/cli.js',
        metroConfigName: 'metro.config.js',
    });
});

test('Execute task.rnv.start in hosted mode', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'tvos';
    ctx.program.hosted = true;
    // WHEN
    await taskRnvStart.fn?.(ctx, 'parent', originTask);
    // THEN
    expect(logError).toHaveBeenCalledWith('This platform does not support hosted mode', true);
});
