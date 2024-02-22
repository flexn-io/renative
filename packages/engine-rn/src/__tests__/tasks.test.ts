import { createRnvApi, createRnvContext, executeTask, getContext } from '@rnv/core';
import taskRnvRun from '../tasks/task.rnv.run';
import taskRnvStart from '../tasks/task.rnv.start';
import { startReactNative } from '@rnv/sdk-react-native';
import { getIosDeviceToRunOn, runXcodeProject } from '@rnv/sdk-apple';

jest.mock('fs');
jest.mock('axios');
jest.mock('@rnv/core');
jest.mock('@rnv/sdk-apple');
jest.mock('@rnv/sdk-android');
jest.mock('@rnv/sdk-utils');
jest.mock('@rnv/sdk-react-native');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

const originTask = undefined;

test('Execute task.rnv.run', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'ios';
    // jest.mocked(executeAsync).mockReturnValue(Promise.resolve('{}'));
    jest.mocked(getIosDeviceToRunOn).mockResolvedValueOnce('');
    // WHEN
    await taskRnvRun.fn?.(ctx, undefined, originTask);
    // THEN
    // await expect(taskRnvRun.fn?.(ctx, undefined, originTask)).resolves.toEqual(true);
    expect(runXcodeProject).toHaveBeenCalledWith(ctx, '');

    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});

test('Execute task.rnv.start with no parent', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'ios';
    jest.mocked(executeTask).mockResolvedValueOnce(undefined);
    // WHEN
    await taskRnvStart.fn?.(ctx, undefined, originTask);
    // THEN
    expect(startReactNative).toHaveBeenCalledWith(ctx, { waitForBundler: true });
});

test('Execute task.rnv.start', async () => {
    // GIVEN
    const ctx = getContext();
    ctx.platform = 'ios';
    // WHEN
    await taskRnvStart.fn?.(ctx, 'parent', originTask);
    // THEN
    expect(startReactNative).toHaveBeenCalledWith(ctx, { waitForBundler: false });
    // await expect(taskRnvRun.fn?.(ctx, undefined, originTask)).resolves.toEqual(true);
});
