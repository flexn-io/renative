import { logSuccess, writeFileSync, ejectPlatform, logError, inquirerPrompt } from '@rnv/core';
import task from '../taskPlatformEject';

jest.mock('@rnv/core', () => ({
    chalk: jest.fn().mockReturnValue({
        bold: {
            white: jest.fn((str) => str),
        },
    }),
    logSuccess: jest.fn(),
    logError: jest.fn(),
    logInfo: jest.fn(),
    writeFileSync: jest.fn(),
    generatePlatformChoices: jest.fn().mockReturnValue([
        { name: 'android', isConnected: true },
        { name: 'ios', isConnected: true },
    ]),
    ejectPlatform: jest.fn(),
    inquirerPrompt: jest.fn().mockResolvedValue({
        ejectedPlatforms: ['android', 'ios'],
    }),
    RnvPlatformKey: { android: 'android', ios: 'ios' },
    createTask: jest.fn((args) => args),
    RnvTaskName: { platformEject: 'platformEject' },
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('taskPlatformEject', () => {
    it('ejects selected platform and updates project config', async () => {
        // GIVEN
        const ctx = {
            platform: 'android',
            files: {
                project: {
                    config: {
                        project: {
                            paths: {
                                platformTemplatesDirs: {
                                    android: './platformTemplates',
                                },
                            },
                        },
                    },
                    config_original: {
                        project: {
                            paths: {
                                platformTemplatesDirs: {
                                    android: './platformTemplates',
                                },
                            },
                        },
                    },
                },
            },
            paths: {
                project: {
                    config: '/path/to/project/config',
                },
            },
        };

        // WHEN
        await task.fn?.({ ctx } as any);

        // THEN
        expect(ejectPlatform).toHaveBeenCalledWith('android');
        expect(writeFileSync).toHaveBeenCalledWith('/path/to/project/config', {
            project: {
                paths: {
                    platformTemplatesDirs: {
                        android: './platformTemplates',
                    },
                },
            },
        });
        expect(logSuccess).toHaveBeenCalledWith(
            'android platform templates are located in ./platformTemplates now. You can edit them directly!'
        );
    });

    it('logs an error if no platforms are selected', async () => {
        // GIVEN
        const ctx = {
            files: {
                project: {
                    config: {
                        paths: {
                            platformTemplatesDirs: {
                                android: './platformTemplates',
                            },
                        },
                    },
                    config_original: {
                        paths: {
                            platformTemplatesDirs: {
                                android: './platformTemplates',
                            },
                        },
                    },
                },
            },
            paths: {
                project: {
                    config: '/path/to/project/config',
                },
            },
        };

        (inquirerPrompt as jest.Mock).mockResolvedValue({ ejectedPlatforms: [] });

        // WHEN

        await task.fn?.({ ctx } as any);
        // THEN
        expect(logError).toHaveBeenCalledWith(
            `You haven't selected any platform to eject.\nTIP: You can select options with SPACE key before pressing ENTER!`
        );
    });
});
