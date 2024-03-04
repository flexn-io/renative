import { createRnvApi, createRnvContext, getContext, logError, doResolve, executeTask } from '@rnv/core';
import taskStart from '../taskStart';
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

test('Execute task.rnv.start with no parent', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'tvos';
    jest.mocked(doResolve).mockReturnValueOnce('MOCKED_PATH');
    // WHEN
    await taskStart.fn?.(ctx, undefined, undefined);
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
    await taskStart.fn?.(ctx, 'parent', undefined);
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
    await taskStart.fn?.(ctx, 'parent', undefined);
    // THEN
    expect(logError).toHaveBeenCalledWith('This platform does not support hosted mode', true);
});
