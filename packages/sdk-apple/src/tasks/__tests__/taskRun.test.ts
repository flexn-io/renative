import { createRnvContext, getContext } from '@rnv/core';
import taskRun from '../taskRun';
import { getIosDeviceToRunOn, runXcodeProject } from '../../runner';

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
    jest.mocked(getIosDeviceToRunOn).mockResolvedValueOnce('MOCK_DEVICE_ARGS');
    // WHEN
    await taskRun.fn?.({
        ctx,
        taskName: 'MOCK_taskName',
        originTaskName: 'MOCK_originTaskName',
        parentTaskName: 'MOCK_parentTaskName',
        shouldSkip: false,
    });
    // THEN
    expect(runXcodeProject).toHaveBeenCalledWith('MOCK_DEVICE_ARGS');
});
