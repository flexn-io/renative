// will get back to this test later - seems difficult to understand yet.

import task from '../taskProjectConfigure';
import {
    getContext,
    fsExistsSync,
    fsMkdirSync,
    updateRenativeConfigs,
    executeTask,
    configureRuntimeDefaults,
    applyTemplate,
    findSuitableTask,
    initializeTask,
    versionCheck,
    configureEngines,
    resolvePluginDependants,
    configurePlugins,
    cleanPlaformAssets,
    copyRuntimeAssets,
    generatePlatformAssetsRuntimeConfig,
    overrideTemplatePlugins,
    checkForPluginDependencies,
} from '@rnv/core';
import { configureFonts } from '@rnv/sdk-utils';
import { checkCrypto } from '../../crypto/common';
import { checkAndInstallIfRequired } from '../../../taskHelpers';

jest.mock('../../crypto/common');
jest.mock('../../../taskHelpers', () => ({
    checkAndInstallIfRequired: jest.fn().mockReturnValue(true),
    installPackageDependenciesAndPlugins: jest.fn().mockReturnValue(true),
}));

beforeEach(() => {
    jest.resetAllMocks();
});

jest.mock('@rnv/core', () => ({
    ...jest.requireActual('@rnv/core'),
    chalk: () => {
        return {
            bold: jest.fn().mockReturnValue('bold'),
        };
    },
    getContext: jest.fn(),
    checkForPluginDependencies: jest.fn().mockResolvedValue(true),
    configurePlugins: jest.fn().mockResolvedValue(true),
    overrideTemplatePlugins: jest.fn().mockResolvedValue(true),
    resolvePluginDependants: jest.fn().mockResolvedValue(true),
    updateRenativeConfigs: jest.fn().mockResolvedValue(true),
    configureRuntimeDefaults: jest.fn().mockResolvedValue(true),
    applyTemplate: jest.fn().mockResolvedValue(true),
    isTemplateInstalled: jest.fn().mockReturnValue(true),
    fsExistsSync: jest.fn(),
    fsMkdirSync: jest.fn(),
    checkAndMigrateProject: jest.fn().mockResolvedValue(true),
    copyRuntimeAssets: jest.fn().mockResolvedValue(true),
    cleanPlaformAssets: jest.fn().mockResolvedValue(true),
    versionCheck: jest.fn().mockResolvedValue(true),
    configureEngines: jest.fn().mockResolvedValue(true),
    executeTask: jest.fn().mockResolvedValue(true),
    initializeTask: jest.fn().mockResolvedValue(true),
    findSuitableTask: jest.fn(),
    generatePlatformAssetsRuntimeConfig: jest.fn().mockResolvedValue(true),
    generateLocalJsonSchemas: jest.fn().mockResolvedValue(true),
    RnvTaskName: {
        projectConfigure: 'project configure',
        workspaceConfigure: 'workspace configure',
        appConfigure: 'app configure',
        cryptoDecrypt: 'crypto decrypt',
        templateApply: 'template apply',
    },
}));
jest.mock('@rnv/sdk-utils');

describe('taskProjectConfigure', () => {
    it('should configure the project correctly', async () => {
        // GIVEN
        const ctx = {
            paths: {
                project: {
                    builds: {
                        dir: '/path/to/builds',
                    },
                    configExists: true,
                    config: '/path/to/config',
                },
                workspace: {
                    dir: '/path/to/workspace',
                },
            },
            files: {
                project: {
                    package: {
                        name: 'test-package',
                    },
                },
            },
            runtime: {
                requiresBootstrap: true,
                disableReset: false,
            },
            buildConfig: {
                isTemplate: false,
                platforms: {},
            },
            program: {
                opts: () => ({
                    only: false,
                    resetHard: false,
                    resetAssets: false,
                }),
            },
        };
        (getContext as jest.Mock).mockReturnValue(ctx);
        const taskName = 'taskName';
        const originTaskName = 'originTaskName';
        const parentTaskName = 'parentTaskName';
        // WHEN
        await task.fn?.({ ctx, taskName, originTaskName, parentTaskName } as any);
        // THEN
        expect(fsExistsSync).toHaveBeenCalledWith(ctx.paths.project.builds.dir);
        expect(fsMkdirSync).toHaveBeenCalledWith(ctx.paths.project.builds.dir);
        expect(updateRenativeConfigs).toHaveBeenCalled();
        expect(executeTask).toHaveBeenCalledWith(
            expect.objectContaining({
                taskName: 'workspace configure',
            })
        );
        expect(executeTask).toHaveBeenCalledWith(
            expect.objectContaining({
                taskName: 'app configure',
            })
        );
        expect(checkAndInstallIfRequired).toHaveBeenCalled();
        expect(checkCrypto).toHaveBeenCalled();
        expect(configureRuntimeDefaults).toHaveBeenCalled();
        expect(applyTemplate).toHaveBeenCalled();
        expect(findSuitableTask).toHaveBeenCalled();
        expect(initializeTask).not.toHaveBeenCalled();
        expect(versionCheck).toHaveBeenCalledWith(ctx);
        expect(configureEngines).toHaveBeenCalledWith(ctx);
        expect(resolvePluginDependants).toHaveBeenCalled();
        expect(configurePlugins).toHaveBeenCalled();
        expect(cleanPlaformAssets).not.toHaveBeenCalled();
        expect(copyRuntimeAssets).toHaveBeenCalled();
        expect(generatePlatformAssetsRuntimeConfig).toHaveBeenCalled();
        expect(overrideTemplatePlugins).toHaveBeenCalled();
        expect(checkForPluginDependencies).toHaveBeenCalled();
        expect(configureFonts).toHaveBeenCalled();
    });
});
