import { createRnvApi, createRnvContext, executeTask, getContext } from '@rnv/core';
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
    ctx.platform = 'ios';
    jest.mocked(executeTask).mockResolvedValueOnce(undefined);
    // WHEN
    await taskRnvStart.fn?.(ctx, undefined, originTask);
    // THEN
    expect(startReactNative).toHaveBeenCalledWith(ctx, { waitForBundler: true });
});

test('Execute task.rnv.start', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'ios';
    // WHEN
    await taskRnvStart.fn?.(ctx, 'parent', originTask);
    // THEN
    expect(startReactNative).toHaveBeenCalledWith(ctx, { waitForBundler: false });
});
