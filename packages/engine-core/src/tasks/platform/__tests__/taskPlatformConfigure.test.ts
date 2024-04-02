import {
    configureRuntimeDefaults,
    createPlatformBuild,
    createRnvContext,
    executeTask,
    getContext,
    resolveEngineDependencies,
} from '@rnv/core';
import taskPlatformConfigure from '../taskPlatformConfigure';
import { checkAndInstallIfRequired } from '../../../taskHelpers';
import { isBuildSchemeSupported } from '../../../buildSchemes';

jest.mock('../../../buildSchemes');
jest.mock('../../../taskHelpers');
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
    jest.mocked(checkAndInstallIfRequired).mockResolvedValue(true);
    //WHEN
    await expect(
        taskPlatformConfigure.fn?.({
            ctx,
            taskName: 'MOCK_taskName',
            originTaskName: 'MOCK_originTaskName',
            parentTaskName: 'MOCK_parentTaskName',
            shouldSkip: false,
        })
    ).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith({
        isOptional: true,
        originTaskName: 'MOCK_originTaskName',
        parentTaskName: 'MOCK_taskName',
        taskName: 'sdk configure',
    });
    expect(isBuildSchemeSupported).toHaveBeenCalled();
    expect(configureRuntimeDefaults).toHaveBeenCalled();
    expect(createPlatformBuild).toHaveBeenCalled();
    expect(resolveEngineDependencies).toHaveBeenCalled();
    expect(checkAndInstallIfRequired).toHaveBeenCalled();
});
