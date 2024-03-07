import { createRnvContext, executeTask, getContext } from '@rnv/core';
import taskPlatformConfigure from '../taskPlatformConfigure';

jest.mock('../../../common');
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
    await expect(taskPlatformConfigure.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith(ctx, 'project configure', 'platform configure', undefined);
});
