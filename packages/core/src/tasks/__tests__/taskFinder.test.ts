import { findSuitableTask } from '../taskFinder';
import { getContext } from '../../context/provider';
import { generateContextDefaults } from '../../context/defaults';
import { getTaskNameFromCommand } from '../taskHelpers';
import { getRegisteredTasks } from '../taskRegistry';
import { RnvTaskMap } from '../types';
import { inquirerPrompt } from '../../api';

jest.mock('../taskHelpers');
jest.mock('../taskRegistry');
jest.mock('chalk');
jest.mock('../../logger');
jest.mock('../../context/provider');
jest.mock('../../api');

beforeEach(() => {
    // NOTE: do not call createRnvContext() in core library itself. It is not a mock
});

afterEach(() => {
    jest.resetAllMocks();
});

const MOCK_TASKS: RnvTaskMap = {
    ['en1::mock-task']: {
        description: 'mock task 1 with ios',
        task: 'mock-task',
        platforms: ['ios'],
        options: [],
    },
    ['en1::mock-task-2']: {
        description: 'mock task 2',
        task: 'mock-task-2',
        options: [],
    },
    ['en2::mock-task']: {
        description: 'mock task 1 with android',
        task: 'mock-task',
        platforms: ['android'],
        options: [],
    },
};

describe('Get suitable tasks', () => {
    it('should return matching task for matching command', async () => {
        // GIVEN
        jest.mocked(getTaskNameFromCommand).mockReturnValue('mock-task-2');
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(getRegisteredTasks).mockReturnValue({ ...MOCK_TASKS });
        // WHEN
        const result = await findSuitableTask();
        // THEN
        expect(result?.description).toEqual('mock task 2');
    });

    it('should return matching task filtered by command and platform out of 2 conflicting ones', async () => {
        // GIVEN
        jest.mocked(getTaskNameFromCommand).mockReturnValue('mock-task');
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const ctx = getContext();
        ctx.platform = 'ios';
        jest.mocked(getRegisteredTasks).mockReturnValue({ ...MOCK_TASKS });
        // WHEN
        const result = await findSuitableTask();
        // THEN
        expect(result?.description).toEqual('mock task 1 with ios');
    });

    it('should trigger inquirer if result is more than 1 task available', async () => {
        // GIVEN
        jest.mocked(getTaskNameFromCommand).mockReturnValue('mock-task');
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(inquirerPrompt).mockResolvedValue({ result: MOCK_TASKS['en1::mock-task'] });
        const ctx = getContext();
        ctx.platform = null;
        jest.mocked(getRegisteredTasks).mockReturnValue({ ...MOCK_TASKS });
        // WHEN
        const result = await findSuitableTask();
        // THEN
        expect(inquirerPrompt).toHaveBeenCalledTimes(1);
        expect(result).toEqual(MOCK_TASKS['en1::mock-task']);
    });
});
