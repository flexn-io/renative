import { createRnvContext, doResolve, executeTask, getContext } from '@rnv/core';
import taskStart from '../taskStart';
import { startReactNative } from '@rnv/sdk-react-native';

jest.mock('@rnv/core');

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
    it('Execute task.rnv.start with no parent', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'tvos';
        jest.mocked(doResolve).mockReturnValueOnce('MOCKED_PATH');
        // WHEN
        await taskStart.fn?.(ctx, undefined, undefined);
        // THEN
        expect(executeTask).toHaveBeenCalledTimes(1);
        expect(startReactNative).toHaveBeenCalledWith({
            waitForBundler: true,
            customCliPath: 'MOCKED_PATH/local-cli/cli.js',
            metroConfigName: 'metro.config.js',
        });
    });

    it('Execute task.rnv.start', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'tvos';
        jest.mocked(doResolve).mockReturnValueOnce('MOCKED_PATH');
        // WHEN
        await taskStart.fn?.(ctx, 'parent', undefined);
        // THEN
        expect(startReactNative).toHaveBeenCalledWith({
            waitForBundler: false,
            customCliPath: 'MOCKED_PATH/local-cli/cli.js',
            metroConfigName: 'metro.config.js',
        });
    });

    it('Execute task.rnv.start in hosted mode', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'tvos';
        ctx.program.hosted = true;
        // WHEN // THEN
        await expect(taskStart.fn?.(ctx, 'parent', undefined)).rejects.toBe(
            'This platform does not support hosted mode'
        );
    });
});