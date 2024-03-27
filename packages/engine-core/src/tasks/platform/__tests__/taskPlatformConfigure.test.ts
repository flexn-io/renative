import { createRnvContext, executeTask, getContext } from '@rnv/core';
import taskPlatformConfigure from '../taskPlatformConfigure';

jest.mock('../../../buildSchemes');
jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.platform.configure', async () => {
    //GIVEN
    const ctx = getContext();
    //WHEN
    await expect(
        taskPlatformConfigure.fn?.({
            ctx,
            taskName: 'MOCK_taskName',
            originTaskName: 'MOCK_originTaskName',
            parentTaskName: 'MOCK_parentTaskName',
            shouldSkip: false,
        })
    ).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith({
        isOptional: true,
        originTaskName: 'MOCK_originTaskName',
        parentTaskName: 'MOCK_taskName',
        taskName: 'sdk configure',
    });
    expect(executeTask).toHaveBeenCalledWith({
        originTaskName: 'MOCK_originTaskName',
        parentTaskName: 'MOCK_taskName',
        taskName: 'install',
    });
});
