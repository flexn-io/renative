import { createRnvContext, executeTask, getContext } from '@rnv/core';
import taskKill from '../taskKill';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-utils');
jest.mock('kill-port');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.kill', async () => {
    //GIVEN
    const ctx = getContext();
    ctx.paths.project.configExists = true;
    //WHEN
    await expect(taskKill.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith('app configure', 'kill', undefined);
});
