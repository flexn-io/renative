import { getAllSuitableTasks } from '..';
import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import { getRegisteredEngines } from '../../engines';
import { RnvEngine } from '../../engines/types';
import { RnvTaskMap } from '../types';
// import { DEFAULT_TASK_DESCRIPTIONS } from '../constants';
// import { inquirerPrompt } from '../../api';

const runMockedDescription = 'Run your app in jest';

jest.mock('../../engines');
jest.mock('chalk');
jest.mock('../../logger');
jest.mock('../../api');
jest.mock('../constants', () => ({ DEFAULT_TASK_DESCRIPTIONS: { runMock: runMockedDescription } }));

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

const rnvEngineTasksMock: RnvTaskMap = {
    runMock: {
        description: 'Run your app in browser',
        task: 'runMock',
        options: [],
        platforms: [],
    },
};

const rnvEngineTasksMock2: RnvTaskMap = {
    runMock: {
        description: 'Run your app on android',
        task: 'runMock',
        options: [],
        platforms: [],
    },
};

const rnvEngineMock: RnvEngine = {
    platforms: {
        web: {
            extensions: ['engine-rn-web.jsx'],
            defaultPort: 8080,
        },
    },
    config: {
        id: 'engine-mock',
        engineExtension: 'mck',
        overview: 'Mock engine',
    },
    projectDirName: '',
    runtimeExtraProps: {},
    serverDirName: '',
    tasks: rnvEngineTasksMock,
};

const rnvEngineMock2: RnvEngine = {
    platforms: {
        android: {
            extensions: ['engine-rn.jsx'],
            defaultPort: 8081,
        },
    },
    config: {
        id: 'engine-mock2',
        engineExtension: 'mck2',
        overview: 'Mock engine two',
    },
    projectDirName: '',
    runtimeExtraProps: {},
    serverDirName: '',
    tasks: rnvEngineTasksMock2,
};

const singleEnginePayload: RnvEngine[] = [rnvEngineMock];
const dualEnginePayload: RnvEngine[] = [rnvEngineMock, rnvEngineMock2];

const expectedSingleEngineResult = {
    runMock: {
        description: runMockedDescription,
        command: rnvEngineTasksMock.runMock.task,
        asArray: [rnvEngineTasksMock.runMock.task],
        isGlobalScope: undefined,
        isPriorityOrder: undefined,
        isPrivate: undefined,
        name: `${rnvEngineTasksMock.runMock.task} (${runMockedDescription})`,
        params: [],
        providers: [rnvEngineMock.config.id],
        subCommand: undefined,
        value: rnvEngineTasksMock.runMock.task,
    },
};

const expectedDualEngineResult = {
    runMock: {
        ...expectedSingleEngineResult.runMock,
        isPriorityOrder: true,
        providers: [rnvEngineMock.config.id, rnvEngineMock2.config.id],
    },
};

describe('Get suitable tasks', () => {
    it('should return all tasks for given engines', () => {
        // GIVEN
        const c = getContext();
        jest.mocked(getRegisteredEngines).mockReturnValue(singleEnginePayload);
        // WHEN
        const result = getAllSuitableTasks(c);
        // THEN
        expect(result).toEqual(expectedSingleEngineResult);
    });

    it('should return all tasks when all engines are registered', () => {
        // GIVEN
        const c = getContext();
        jest.mocked(getRegisteredEngines).mockReturnValue(dualEnginePayload);
        // WHEN
        const result = getAllSuitableTasks(c);
        // THEN
        expect(result).toEqual(expectedDualEngineResult);
    });
});

// TODO JS loop, will be added in the next PR
// describe('findSuitableTask', () => {
//     it('should return undefined when specificTask is not provided and c.command is not set', async () => {
//         // GIVEN
//         const c = getContext();
//         jest.mocked(getRegisteredEngines).mockReturnValue(mockEngineRegistration);
//         jest.mocked(inquirerPrompt).mockReturnValue(new Promise((resolve) => resolve({ selectedTask: 'run' })));
//         jest.mocked(getEngineSubTasks).mockReturnValue([mockEngineRegistration[0].tasks.run]);

//         // WHEN
//         const result = await findSuitableTask(c);

//         // THEN
//         expect(result).toBeUndefined();
//     });
// });
