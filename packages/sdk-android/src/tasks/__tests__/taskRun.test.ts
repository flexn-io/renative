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

describe('taskRun tests', () => {
    it('Execute task.rnv.run', async () => {
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
        await taskRun.fn?.({
            ctx,
            taskName: 'MOCK_taskName',
            originTaskName: 'MOCK_originTaskName',
            parentTaskName: 'MOCK_parentTaskName',
            shouldSkip: false,
        });
        // THEN
        expect(runAndroid).toHaveBeenCalledWith(mockedDevice);
    });
});
