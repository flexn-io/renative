import { createRnvContext, getContext } from '@rnv/core';
import taskRun from '../taskRun';
import { getIosDeviceToRunOn, runXcodeProject } from '@rnv/sdk-apple';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-apple');
jest.mock('@rnv/sdk-android');
jest.mock('@rnv/sdk-react-native');

beforeEach(() => {
    createRnvContext();
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
    await taskRun.fn?.(ctx, undefined, undefined);
    // THEN
    expect(runXcodeProject).toHaveBeenCalledWith(ctx, 'MOCK_DEVICE_ARGS');
});
