import taskRnvRun from '../tasks/task.rnv.run';
import { generateMockConfig } from '../../../jest-preset-rnv/mocks';

jest.mock('fs');
jest.mock('axios');
jest.mock('@rnv/core');
jest.mock('@rnv/sdk-apple');

beforeEach(() => {
    //Do nothing
});

afterEach(() => {
    //Do nothing
});

const originTask = undefined;
const c = generateMockConfig({});

const { executeAsync } = require('@rnv/core');

test('Execute task.rnv.run', async () => {
    // const taskManager = require('../../src/core/taskManager/index.js');
    // await taskRnvRun.fn(c, null, originTask);
    executeAsync.mockReturnValue(Promise.resolve('{}'));
    await taskRnvRun.fn(c, undefined, originTask);
    await expect(taskRnvRun.fn(c, undefined, originTask)).resolves.toEqual(true);
    // expect(taskManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
});
