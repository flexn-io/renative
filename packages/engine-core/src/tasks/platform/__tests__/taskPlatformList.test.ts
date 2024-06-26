import { createRnvContext, generatePlatformChoices, getContext, logToSummary } from '@rnv/core';
import taskPlatformList from '../taskPlatformList';

jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('taskPlatformList tests', () => {
    it('Execute task.rnv.platform.list', async () => {
        //GIVEN
        const ctx = getContext();
        jest.mocked(generatePlatformChoices).mockReturnValue([
            { name: 'MOCK_PLATFORM', value: 'android', isConnected: false },
        ]);
        //WHEN
        await expect(
            taskPlatformList.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        //THEN
        expect(taskPlatformList.dependsOn).toEqual(['project configure']);
        expect(generatePlatformChoices).toHaveBeenCalled();
        expect(logToSummary).toHaveBeenCalledWith(`Platforms:\n\n [1]> MOCK_PLATFORM`);
    });
});
