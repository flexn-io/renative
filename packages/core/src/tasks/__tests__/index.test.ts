import { getAllSuitableTasks } from '..';
import { createRnvApi, createRnvContext, getContext } from '@rnv/core';
import { getRegisteredEngines } from '../../engines';
// import { inquirerPrompt } from '../../api';

jest.mock('../../engines');
jest.mock('chalk');
jest.mock('../../logger');
jest.mock('../../api');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

const mockEngineRegistration = [
    {
        tasks: {
            run: {
                description: 'Run your app in browser',
                task: 'run',
                options: [
                    {
                        shortcut: 'i',
                        value: 'value',
                        description: 'Show full debug Info',
                        key: 'info',
                    },
                    {
                        shortcut: 'H',
                        value: 'value',
                        isRequired: true,
                        description: 'custom Host ip',
                        key: 'host',
                    },
                ],
                platforms: [],
            },
            build: {
                description: 'Build project binary',
                task: 'build',
                options: [
                    {
                        shortcut: 'i',
                        value: 'value',
                        description: 'Show full debug Info',
                        key: 'info',
                    },
                    {
                        description: 'CI/CD flag so it wont ask questions',
                        key: 'ci',
                    },
                ],
                platforms: [],
            },
            configure: {
                description: 'Configure current project',
                task: 'configure',
                options: [
                    {
                        shortcut: 'i',
                        value: 'value',
                        description: 'Show full debug Info',
                        key: 'info',
                    },
                ],
                platforms: [],
            },
        },
        config: {
            $schema: '../../.rnv/schema/rnv.engine.json',
            id: 'engine-rn-web',
            overview: 'React native based engine with web transpiler provided by react-native-web',
            plugins: {
                react: 'source:rnv',
                'react-art': 'source:rnv',
                'react-dom': 'source:rnv',
                'react-native': 'source:rnv',
                'react-native-web': 'source:rnv',
            },
            npm: {
                devDependencies: {},
            },
            platforms: {
                tizen: {
                    npm: {
                        dependencies: {
                            raf: '3.4.1',
                        },
                    },
                },
                web: {},
                webtv: {},
                webos: {},
                tizenwatch: {},
                tizenmobile: {},
                chromecast: {},
                kaios: {},
            },
            engineExtension: 'ext',
        },
        projectDirName: '',
        serverDirName: '',
        runtimeExtraProps: {},
        platforms: {
            web: {
                defaultPort: 8080,
                isWebHosted: true,
                extensions: ['engine-rn-web.jsx'],
            },
            chromecast: {
                defaultPort: 8095,
                isWebHosted: true,
                extensions: ['engine-rn-web.jsx'],
            },
        },
        rootPath: 'renative/packages/engine-rn-web',
        originalTemplatePlatformsDir: 'renative/packages/engine-rn-web/templates/platforms',
        originalTemplatePlatformProjectDir: 'renative/packages/engine-rn-web/templates/platforms',
    },
];

const tasksExpected = {
    run: {
        value: 'run',
        command: 'run',
        name: 'run (Run your app in browser)',
        asArray: ['run'],
        description: 'Run your app in browser',
        params: [
            { shortcut: 'i', value: 'value', description: 'Show full debug Info', key: 'info' },
            { shortcut: 'H', value: 'value', isRequired: true, description: 'custom Host ip', key: 'host' },
        ],
        providers: ['engine-rn-web'],
    },
    build: {
        value: 'build',
        command: 'build',
        name: 'build (Build project binary)',
        asArray: ['build'],
        description: 'Build project binary',
        params: [
            { shortcut: 'i', value: 'value', description: 'Show full debug Info', key: 'info' },
            { description: 'CI/CD flag so it wont ask questions', key: 'ci' },
        ],
        providers: ['engine-rn-web'],
    },
    configure: {
        value: 'configure',
        command: 'configure',
        name: 'configure (Configure current project)',
        asArray: ['configure'],
        description: 'Configure current project',
        params: [{ shortcut: 'i', value: 'value', description: 'Show full debug Info', key: 'info' }],
        providers: ['engine-rn-web'],
    },
};

describe('Get suitable tasks', () => {
    it('should return empty when no engines are registered', () => {
        // GIVEN
        const c = getContext();
        jest.mocked(getRegisteredEngines).mockReturnValue([]);
        // WHEN
        const result = getAllSuitableTasks(c);
        // THEN
        expect(result).toEqual({});
    });

    it('should return all tasks when all engines are registered', () => {
        // GIVEN
        const c = getContext();
        jest.mocked(getRegisteredEngines).mockReturnValue(mockEngineRegistration);
        // WHEN
        const result = getAllSuitableTasks(c);
        // THEN
        expect(result).toEqual(tasksExpected);
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
