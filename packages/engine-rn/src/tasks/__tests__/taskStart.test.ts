import { createRnvApi, createRnvContext, executeTask, getContext } from '@rnv/core';
import taskRnvStart from '../taskStart';
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
    ctx.platform = 'ios';
    jest.mocked(executeTask).mockResolvedValueOnce(undefined);
    // WHEN
    await taskRnvStart.fn?.(ctx, undefined, undefined);
    // THEN
    expect(startReactNative).toHaveBeenCalledWith(ctx, { waitForBundler: true });
});

test('Execute task.rnv.start', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'ios';
    // WHEN
    await taskRnvStart.fn?.(ctx, 'parent', undefined);
    // THEN
    expect(startReactNative).toHaveBeenCalledWith(ctx, { waitForBundler: false });
});
