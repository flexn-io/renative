import {
    createRnvContext,
    executeAsync,
    fsExistsSync,
    fsReaddirSync,
    getContext,
    inquirerPrompt,
    removeDirs,
} from '@rnv/core';
import taskClean from '../taskClean';

jest.mock('@rnv/core');
jest.mock('path');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.clean', async () => {
    //GIVEN
    const ctx = getContext();
    jest.mocked(inquirerPrompt).mockReturnValue(
        Promise.resolve({ confirm: true, confirmBuilds: true, confirmLocals: true, confirmCache: true })
    );
    jest.mocked(fsExistsSync).mockReturnValue(true);
    jest.mocked(fsReaddirSync).mockReturnValue([]);
    ctx.program.ci = false;
    //WHEN
    await expect(taskClean.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(removeDirs).toHaveBeenCalledTimes(3);
    expect(executeAsync).toHaveBeenCalledWith('watchman watch-del-all');
    expect(executeAsync).toHaveBeenCalledWith(
        'npx rimraf -I $TMPDIR/metro-* && npx rimraf -I $TMPDIR/react-* && npx rimraf -I $TMPDIR/haste-*'
    );
});
