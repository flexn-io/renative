import { createRnvApi, createRnvContext, executeAsync, getContext, removeDirs } from '@rnv/core';
import taskRnvClean from '../task.rnv.clean';

jest.mock('@rnv/core');
jest.mock('path');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.clean', async () => {
    //GIVEN
    const ctx = getContext();
    const { inquirerPrompt } = require('@rnv/core');
    inquirerPrompt.mockReturnValue(
        Promise.resolve({ confirm: true, confirmBuilds: true, confirmLocals: true, confirmCache: true })
    );
    ctx.program.ci = false;
    //WHEN
    await expect(taskRnvClean.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(removeDirs).toHaveBeenCalledTimes(3);
    expect(executeAsync).toHaveBeenCalledWith(ctx, 'watchman watch-del-all');
    expect(executeAsync).toHaveBeenCalledWith(
        ctx,
        'npx rimraf -I $TMPDIR/metro-* && npx rimraf -I $TMPDIR/react-* && npx rimraf -I $TMPDIR/haste-*'
    );
});
