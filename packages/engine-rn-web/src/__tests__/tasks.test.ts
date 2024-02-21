import { createRnvApi, createRnvContext, getContext, getPlatformProjectDir } from '@rnv/core';
import taskRnvRun from '../tasks/task.rnv.run';
import { runWebpackServer } from '@rnv/sdk-webpack';
import { runTizen } from '@rnv/sdk-tizen';

jest.mock('fs');
jest.mock('axios');
jest.mock('@rnv/core');
jest.mock('process');
jest.mock('@rnv/sdk-webpack');
jest.mock('@rnv/sdk-tizen');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

test('Execute task.rnv.run -p web', async () => {
    //GIVEN
    const ctx = getContext();
    ctx.platform = 'web';
    //WHEN
    await taskRnvRun.fn?.(ctx);
    //THEN
    expect(runWebpackServer).toHaveBeenCalled();
});

test('Execute task.rnv.run -p tizen', async () => {
    //GIVEN
    const ctx = getContext();
    ctx.platform = 'tizen';
    (getPlatformProjectDir as jest.Mock<string>).mockReturnValue('');
    //WHEN
    await taskRnvRun.fn?.(ctx);
    //THEN
    expect(runTizen).toHaveBeenCalled();
});
