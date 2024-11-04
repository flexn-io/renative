import task from '../taskPlatformConnect';
import { writeFileSync, logSuccess, inquirerPrompt, generatePlatformChoices, removeDirs } from '@rnv/core';
import path from 'path';

jest.mock('@rnv/core', () => ({
    writeFileSync: jest.fn(),
    logSuccess: jest.fn(),
    logToSummary: jest.fn(),
    removeDirs: jest.fn(),
    generatePlatformChoices: jest.fn(),
    inquirerPrompt: jest.fn(),
    RnvPlatformKey: { android: 'android', ios: 'ios' },
    createTask: jest.fn((args) => args),
    RnvTaskName: { platformConnect: 'platformConnect' },
    chalk: () => {
        return {
            bold: { white: jest.fn() },
        };
    },
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('taskPlatformEject', () => {
    it('should handle ctx.platform being defined', async () => {
        // GIVEN
        const ctx = {
            platform: 'android',
            files: {
                project: {
                    config_original: {
                        project: {
                            paths: {
                                platformTemplatesDirs: {
                                    android: './path/to/android',
                                },
                            },
                        },
                    },
                    config: {
                        project: {
                            paths: {
                                platformTemplatesDirs: {
                                    android: './path/to/android',
                                },
                            },
                        },
                    },
                },
            },
            paths: {
                project: {
                    config: './path/to/config',
                },
            },
        };

        (inquirerPrompt as jest.Mock).mockResolvedValueOnce({ connectedPlatforms: ['android', 'ios'] });

        // WHEN
        await task.fn?.({ ctx } as any);

        // THEN
        expect(writeFileSync).toHaveBeenCalledWith(ctx.paths.project.config, ctx.files.project.config_original);
        expect(logSuccess).toHaveBeenCalled();
    });

    it('should handle ctx.platform being undefined', async () => {
        // GIVEN
        const ctx = {
            files: {
                project: {
                    config_original: {
                        project: {
                            paths: {
                                platformTemplatesDirs: {
                                    android: './path/to/android',
                                    ios: './path/to/ios',
                                },
                            },
                        },
                    },
                    config: {
                        project: {
                            paths: {
                                platformTemplatesDirs: {
                                    android: './path/to/android',
                                    ios: './path/to/ios',
                                },
                            },
                        },
                    },
                },
            },
            paths: {
                project: {
                    platformTemplatesDirs: {
                        android: './path/to/android',
                        ios: './path/to/ios',
                    },
                    config: './path/to/config',
                },
            },
        };

        (generatePlatformChoices as jest.Mock).mockReturnValue([
            { name: 'android', isConnected: false },
            { name: 'ios', isConnected: false },
        ]);

        (inquirerPrompt as jest.Mock)
            .mockResolvedValueOnce({ connectedPlatforms: ['android', 'ios'] })
            .mockResolvedValueOnce({ deletePlatformFolder: true });

        // WHEN
        await task.fn?.({ ctx } as any);

        // THEN
        expect(writeFileSync).toHaveBeenCalledWith(ctx.paths.project.config, ctx.files.project.config_original);
        expect(removeDirs).toHaveBeenCalledWith([
            path.join(ctx.paths.project.platformTemplatesDirs['android'], 'android'),
            path.join(ctx.paths.project.platformTemplatesDirs['ios'], 'ios'),
        ]);
        expect(logSuccess).toHaveBeenCalled();
    });
});
