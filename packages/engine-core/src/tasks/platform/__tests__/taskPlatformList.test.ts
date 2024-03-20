import { createRnvContext, executeTask, generatePlatformChoices, getContext } from '@rnv/core';
import taskPlatformList from '../taskPlatformList';

jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.platform.list', async () => {
    //GIVEN
    const ctx = getContext();
    jest.mocked(generatePlatformChoices).mockReturnValue([]);
    //WHEN
    await expect(taskPlatformList.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith('project configure', 'platform list', undefined);
});
