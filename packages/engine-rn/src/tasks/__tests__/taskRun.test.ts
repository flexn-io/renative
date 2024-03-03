import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import taskRnvRun from '../taskRun';
import { getIosDeviceToRunOn, runXcodeProject } from '@rnv/sdk-apple';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-apple');
jest.mock('@rnv/sdk-android');
jest.mock('@rnv/sdk-react-native');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.run', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'ios';
    jest.mocked(getIosDeviceToRunOn).mockResolvedValueOnce('MOCK_DEVICE_ARGS');
    // WHEN
    await taskRnvRun.fn?.(ctx, undefined, undefined);
    // THEN
    expect(runXcodeProject).toHaveBeenCalledWith(ctx, 'MOCK_DEVICE_ARGS');
});
