import { createRnvContext, getContext } from '@rnv/core';
import taskRun from '../taskRun';

import { runWebNext } from '../../sdk/runner';

jest.mock('fs');
jest.mock('path');
jest.mock('@rnv/core');
jest.mock('../../sdk/runner');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('taskRun tests', () => {
    it('Execute task.rnv.run -p web', async () => {
        //GIVEN
        const ctx = getContext();
        //WHEN
        await expect(
            taskRun.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(undefined);
        //THEN
        expect(runWebNext).toHaveBeenCalled();
    });
});
