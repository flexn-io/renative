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

describe('taskKill tests', () => {
    it('Execute task.rnv.kill', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.paths.project.configExists = true;
        //WHEN
        await expect(
            taskKill.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        //THEN
        expect(executeTask).toHaveBeenCalledWith({
            originTaskName: 'MOCK_originTaskName',
            parentTaskName: 'MOCK_taskName',
            taskName: 'app configure',
        });
    });
});
