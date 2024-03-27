import { findSuitableTask } from '../taskFinder';
import { DEFAULT_TASK_DESCRIPTIONS } from '../constants';
import { getContext } from '../../context/provider';
import { generateContextDefaults } from '../../context/defaults';
import { getTaskNameFromCommand } from '../taskHelpers';
import { getRegisteredTasks } from '../taskRegistry';

jest.mock('../../engines');
jest.mock('../taskHelpers');
jest.mock('../taskRegistry');
jest.mock('chalk');
jest.mock('../../logger');
jest.mock('../../api');
jest.mock('../../context/provider');
jest.mock('../constants', () => ({ DEFAULT_TASK_DESCRIPTIONS: {} }));
jest.mock('../../projects/dependencies');

beforeEach(() => {
    // NOTE: do not call createRnvContext() in core library itself
});

afterEach(() => {
    jest.resetAllMocks();
});

// const ENGINE_MOCK_PROPS = {
//     platforms: {},
//     config: {
//         id: '',
//         engineExtension: '',
//         overview: '',
//         packageName: '',
//     },
//     projectDirName: '',
//     runtimeExtraProps: {},
//     serverDirName: '',
// };

const MOCK_TASKS = {
    ['en1::mock-task']: {
        description: 'mock task 1',
        task: 'mock-task',
        options: [],
    },
    ['en1::mock-task-2']: {
        description: 'mock task 2',
        task: 'mock-task-2',
        options: [],
    },
    ['en2::mock-task']: {
        description: 'mock task 1',
        task: 'mock-task',
        options: [],
    },
};

// const rnvEngineMock1: RnvEngine = {
//     ...ENGINE_MOCK_PROPS,
//     tasks: {
//         ['mock-task']: {
//             description: 'mock task 1',
//             task: 'mock-task',
//             options: [],
//         },
//     },
// };

// const rnvEngineMock2: RnvEngine = {
//     ...ENGINE_MOCK_PROPS,
//     tasks: {
//         //NOTE: order of task here is IMPORTANT
//         ['mock-task-2']: {
//             description: 'mock task 2',
//             task: 'mock-task-2',
//             options: [],
//         },
//         ['mock-task']: {
//             description: 'mock task 1',
//             task: 'mock-task',
//             options: [],
//         },
//     },
// };

describe('Get suitable tasks', () => {
    it('should return all tasks for given 1 engine', () => {
        // GIVEN
        jest.mocked(getTaskNameFromCommand).mockReturnValue('');
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(getRegisteredTasks).mockReturnValue({ ...MOCK_TASKS });
        // jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock1]);
        // jest.mocked(checkIfProjectAndNodeModulesExists).mockResolvedValue();
        // WHEN
        const result = findSuitableTask();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task']);
        expect(result['mock-task'].description).toEqual('mock task 1');
    });

    it('should return common description for tasks from 2 different engines but same name', () => {
        // GIVEN
        jest.mocked(getTaskNameFromCommand).mockReturnValue('mock-task');
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        // jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock1, rnvEngineMock2]);
        jest.mocked(getRegisteredTasks).mockReturnValue({ ...MOCK_TASKS });
        // jest.mocked(checkIfProjectAndNodeModulesExists).mockResolvedValue();
        DEFAULT_TASK_DESCRIPTIONS['mock-task'] = 'mock task common';
        // WHEN
        const result = findSuitableTask();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task', 'mock-task-2']);
        expect(result['mock-task'].description).toEqual('mock task common');
    });

    it('should return first task description for tasks from 2 different engines but same name if common desc not available', () => {
        // GIVEN
        jest.mocked(getTaskNameFromCommand).mockReturnValue('');
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(getRegisteredTasks).mockReturnValue({ ...MOCK_TASKS });
        // jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock2, rnvEngineMock1]);
        // jest.mocked(checkIfProjectAndNodeModulesExists).mockResolvedValue();
        delete DEFAULT_TASK_DESCRIPTIONS['mock-task'];
        // WHEN
        const result = findSuitableTask();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task-2', 'mock-task']);
        expect(result['mock-task'].description).toEqual('mock task 1');
    });
});
