import { createRnvContext, executeTask, getContext } from '@rnv/core';
import taskStart from '../taskStart';
import { startReactNative } from '@rnv/sdk-react-native';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-react-native');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('taskStart', () => {
    it('Execute task.rnv.start with no parent', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        jest.mocked(executeTask).mockResolvedValueOnce(undefined);
        // WHEN
        await taskStart.fn?.(ctx, undefined, undefined);
        // THEN
        expect(startReactNative).toHaveBeenCalledWith({ waitForBundler: true });
    });
    it('Execute task.rnv.start', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        // WHEN
        await taskStart.fn?.(ctx, 'parent', undefined);
        // THEN
        expect(startReactNative).toHaveBeenCalledWith({ waitForBundler: false });
    });
});
