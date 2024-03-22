import { getAllSuitableTasks } from '..';
import { getRegisteredEngines } from '../../engines';
import { RnvEngine } from '../../engines/types';
import { DEFAULT_TASK_DESCRIPTIONS } from '../constants';
import { getContext } from '../../context/provider';
import { generateContextDefaults } from '../../context/defaults';
import { checkIfProjectAndNodeModulesExists } from '../../projects/dependencies';

jest.mock('../../engines');
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

const ENGINE_MOCK_PROPS = {
    platforms: {},
    config: {
        id: '',
        engineExtension: '',
        overview: '',
    },
    projectDirName: '',
    runtimeExtraProps: {},
    serverDirName: '',
};

const rnvEngineMock1: RnvEngine = {
    ...ENGINE_MOCK_PROPS,
    tasks: {
        ['mock-task']: {
            description: 'mock task 1',
            task: 'mock-task',
            options: [],
            platforms: null,
        },
    },
};

const rnvEngineMock2: RnvEngine = {
    ...ENGINE_MOCK_PROPS,
    tasks: {
        //NOTE: order of task here is IMPORTANT
        ['mock-task-2']: {
            description: 'mock task 2',
            task: 'mock-task-2',
            options: [],
            platforms: null,
        },
        ['mock-task']: {
            description: 'mock task 1',
            task: 'mock-task',
            options: [],
            platforms: null,
        },
    },
};

describe('Get suitable tasks', () => {
    it('should return all tasks for given 1 engine', () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock1]);
        jest.mocked(checkIfProjectAndNodeModulesExists).mockResolvedValue();
        // WHEN
        const result = getAllSuitableTasks();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task']);
        expect(result['mock-task'].description).toEqual('mock task 1');
    });

    it('should return common description for tasks from 2 different engines but same name', () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock1, rnvEngineMock2]);
        jest.mocked(checkIfProjectAndNodeModulesExists).mockResolvedValue();
        DEFAULT_TASK_DESCRIPTIONS['mock-task'] = 'mock task common';
        // WHEN
        const result = getAllSuitableTasks();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task', 'mock-task-2']);
        expect(result['mock-task'].description).toEqual('mock task common');
    });

    it('should return first task description for tasks from 2 different engines but same name if common desc not available', () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock2, rnvEngineMock1]);
        jest.mocked(checkIfProjectAndNodeModulesExists).mockResolvedValue();
        delete DEFAULT_TASK_DESCRIPTIONS['mock-task'];
        // WHEN
        const result = getAllSuitableTasks();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task-2', 'mock-task']);
        expect(result['mock-task'].description).toEqual('mock task 1');
    });
});
