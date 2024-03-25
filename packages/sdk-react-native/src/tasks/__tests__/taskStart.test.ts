import { createRnvContext, doResolve, executeTask, getContext } from '@rnv/core';
import taskStart from '../taskStart';
import { startReactNative } from '../../metroRunner';

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-utils');
jest.mock('../../metroRunner');

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
    it('Execute task.rnv.start with no parent and custom customCliPath', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'tvos';
        ctx.runtime.runtimeExtraProps = {
            reactNativePackageName: 'MOCKED_NAME',
            reactNativeMetroConfigName: 'MOCKED_CONFIG',
        };
        jest.mocked(doResolve).mockReturnValueOnce('MOCKED_PATH');
        // WHEN
        await taskStart.fn?.(ctx, undefined, undefined);
        // THEN
        expect(executeTask).toHaveBeenCalledTimes(1);
        expect(startReactNative).toHaveBeenCalledWith({
            waitForBundler: true,
            customCliPath: 'MOCKED_PATH/local-cli/cli.js',
            metroConfigName: 'MOCKED_CONFIG',
        });
    });

    it('Execute task.rnv.start with customCliPath', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'tvos';
        ctx.runtime.runtimeExtraProps = {
            reactNativePackageName: 'MOCKED_NAME',
            reactNativeMetroConfigName: 'MOCKED_CONFIG',
        };
        jest.mocked(doResolve).mockReturnValueOnce('MOCKED_PATH');
        // WHEN
        await taskStart.fn?.(ctx, 'parent', undefined);
        // THEN
        expect(startReactNative).toHaveBeenCalledWith({
            waitForBundler: false,
            customCliPath: 'MOCKED_PATH/local-cli/cli.js',
            metroConfigName: 'MOCKED_CONFIG',
        });
    });

    it('Execute task.rnv.start in hosted mode', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'tvos';
        ctx.program.opts().hosted = true;
        // WHEN // THEN
        await expect(taskStart.fn?.(ctx, 'parent', undefined)).rejects.toBe(
            'This platform does not support hosted mode'
        );
    });
});
