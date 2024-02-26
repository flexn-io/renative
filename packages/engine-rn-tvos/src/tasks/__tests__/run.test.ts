import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import taskRnvRun from '../task.rnv.run';
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

const originTask = undefined;

test('Execute task.rnv.run', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'tvos';
    jest.mocked(getIosDeviceToRunOn).mockResolvedValue('MOCK_DEVICE_ARGS');
    // WHEN
    await taskRnvRun.fn?.(ctx, undefined, originTask);
    // THEN
    expect(runXcodeProject).toHaveBeenCalledWith(ctx, 'MOCK_DEVICE_ARGS');
});
