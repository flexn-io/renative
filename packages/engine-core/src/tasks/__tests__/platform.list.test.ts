import { createRnvApi, createRnvContext, executeTask, getContext } from '@rnv/core';
import taskRnvPlatformList from '../task.rnv.platform.list';

jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.platform.list', async () => {
    //GIVEN
    const ctx = getContext();
    //WHEN
    await expect(taskRnvPlatformList.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith(ctx, 'project configure', 'platform list', undefined);
});
