import { createRnvApi, createRnvContext, executeTask, getContext } from '@rnv/core';
import taskRnvKill from '../taskKill';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-utils');
jest.mock('kill-port');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.kill', async () => {
    //GIVEN
    const ctx = getContext();
    ctx.paths.project.configExists = true;
    //WHEN
    await expect(taskRnvKill.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith(ctx, 'app configure', 'kill', undefined);
});
