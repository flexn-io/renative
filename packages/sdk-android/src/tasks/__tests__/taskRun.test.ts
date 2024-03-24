import { createRnvContext, getContext } from '@rnv/core';
import taskRun from '../taskRun';
import { getAndroidDeviceToRunOn, runAndroid } from '../../runner';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-react-native');
jest.mock('../../runner');

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
    const mockedDevice = {
        name: 'MOCK_DEVICE_NAME',
        udid: 'MOCK_DEVICE_UDID',
        isActive: true,
    };
    jest.mocked(getAndroidDeviceToRunOn).mockResolvedValueOnce(mockedDevice);
    // WHEN
    await taskRun.fn?.(ctx, undefined, undefined);
    // THEN
    expect(runAndroid).toHaveBeenCalledWith(mockedDevice);
});
