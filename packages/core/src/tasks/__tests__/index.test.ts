import { getAllSuitableTasks } from '..';
import { createRnvContext } from '@rnv/core';
import { getRegisteredEngines } from '../../engines';
import { RnvEngine } from '../../engines/types';
import { DEFAULT_TASK_DESCRIPTIONS } from '../constants';

jest.mock('../../engines');
jest.mock('chalk');
jest.mock('../../logger');
jest.mock('../../api');
jest.mock('../constants', () => ({ DEFAULT_TASK_DESCRIPTIONS: {} }));

beforeEach(() => {
    createRnvContext();
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
            platforms: [],
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
            platforms: [],
        },
        ['mock-task']: {
            description: 'mock task 1',
            task: 'mock-task',
            options: [],
            platforms: [],
        },
    },
};

describe('Get suitable tasks', () => {
    it('should return all tasks for given 1 engine', () => {
        // GIVEN
        // const c = getContext();
        jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock1]);
        // WHEN
        const result = getAllSuitableTasks();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task']);
        expect(result['mock-task'].description).toEqual('mock task 1');
    });

    it('should return common description for tasks from 2 different engines but same name', () => {
        // GIVEN
        // const c = getContext();
        jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock1, rnvEngineMock2]);
        DEFAULT_TASK_DESCRIPTIONS['mock-task'] = 'mock task common';

        // WHEN
        const result = getAllSuitableTasks();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task', 'mock-task-2']);
        expect(result['mock-task'].description).toEqual('mock task common');
    });

    it('should return first task description for tasks from 2 different engines but same name if common desc not available', () => {
        // GIVEN
        // const c = getContext();
        jest.mocked(getRegisteredEngines).mockReturnValue([rnvEngineMock2, rnvEngineMock1]);
        delete DEFAULT_TASK_DESCRIPTIONS['mock-task'];
        // WHEN
        const result = getAllSuitableTasks();
        // THEN
        expect(Object.keys(result)).toEqual(['mock-task-2', 'mock-task']);
        expect(result['mock-task'].description).toEqual('mock task 1');
    });
});
