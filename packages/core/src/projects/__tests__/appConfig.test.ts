import { copyBuildsFolder } from '../appConfig';
import { getAppConfigBuildsFolder, getAppFolder, getTimestampPathsConfig } from '../../context/contextProps';
import { isPlatformActive } from '../../platforms';
import { copyTemplatePluginsSync } from '../../plugins';
import { copyFolderContentsRecursiveSync, fsExistsSync } from '../../system/fs';
import { logDefault } from '../../logger';
import { getContext } from '../../context/provider';
import path from 'path';
jest.mock('../../system/injectors');
jest.mock('../../context/provider');
jest.mock('../../context/contextProps');
jest.mock('../../platforms');
jest.mock('../../plugins');
jest.mock('../../system/fs');
jest.mock('../../logger');

beforeEach(() => {
    jest.clearAllMocks();
});

const mockContext = {
    configPropsInjects: [],
    systemPropsInjects: [],
    runtimePropsInjects: [],
    paths: {
        project: {
            appConfigBase: {
                dir: '/path/to/project',
            },
        },
        workspace: {
            project: {
                appConfigBase: {
                    dir: '/path/to/workspace',
                },
            },
            appConfig: {
                dir: '/path/to/appConfig',
            },
        },
        appConfig: {
            dirs: ['/path/to/appConfig1', '/path/to/appConfig2'],
        },
    },
    runtime: {
        currentPlatform: {
            isWebHosted: true,
        },
    },
};

describe('copyBuildsFolder', () => {
    it('should copy builds folder', async () => {
        // GIVEN
        const mockContext = {
            configPropsInjects: [],
            systemPropsInjects: [],
            runtimePropsInjects: [],
            paths: {
                project: {
                    appConfigBase: {
                        dir: '/path/to/project',
                    },
                },
                workspace: {
                    project: {
                        appConfigBase: {
                            dir: '/path/to/workspace',
                        },
                    },
                    appConfig: {
                        dir: '/path/to/appConfig',
                    },
                },
                appConfig: {
                    dirs: ['/path/to/appConfig1', '/path/to/appConfig2'],
                },
            },
            runtime: {
                currentPlatform: {
                    isWebHosted: true,
                },
            },
        };
        (getContext as jest.Mock).mockReturnValue(mockContext);
        (isPlatformActive as jest.Mock).mockReturnValue(true);
        (fsExistsSync as jest.Mock).mockReturnValue(true);
        (getAppFolder as jest.Mock).mockReturnValue('/path/to/appFolder');
        (getAppConfigBuildsFolder as jest.Mock).mockImplementation((dir) => dir);
        (getTimestampPathsConfig as jest.Mock).mockReturnValue({});

        // WHEN
        await copyBuildsFolder();

        // THEN

        const sourcePath1 = getAppConfigBuildsFolder(mockContext.paths.project.appConfigBase.dir);
        const sourcePath1sec = getAppConfigBuildsFolder(mockContext.paths.workspace.project.appConfigBase.dir);
        const sourcePathShared = path.join(mockContext.paths.project.appConfigBase.dir, 'builds/_shared');
        const sourcePath0sec = getAppConfigBuildsFolder(mockContext.paths.workspace.appConfig.dir);
        const sourceV = getAppConfigBuildsFolder(mockContext.paths.appConfig.dirs[0]);
        const destPath = '/path/to/appFolder';
        const allInjects = [];
        const tsPathsConfig = {};

        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledWith(
            sourcePath1,
            destPath,
            true,
            undefined,
            false,
            allInjects,
            tsPathsConfig
        );
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledWith(
            sourcePath1sec,
            destPath,
            true,
            undefined,
            false,
            allInjects,
            tsPathsConfig
        );
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledWith(
            sourcePathShared,
            getAppFolder(),
            true,
            undefined,
            false,
            allInjects
        );
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledWith(
            sourcePath0sec,
            destPath,
            true,
            undefined,
            false,
            allInjects,
            tsPathsConfig
        );
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledWith(
            sourceV,
            destPath,
            true,
            undefined,
            false,
            allInjects,
            tsPathsConfig
        );

        expect(logDefault).toHaveBeenCalledWith('copyBuildsFolder');
        expect(isPlatformActive).toHaveBeenCalled();
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledTimes(6);
        expect(copyTemplatePluginsSync).toHaveBeenCalledWith(mockContext);
    });
    it('paths.appConfig.dirs is not defined and runtime.currentPlatform.isWebHosted is false', async () => {
        // GIVEN
        mockContext.paths.appConfig.dirs = undefined as any;
        mockContext.runtime.currentPlatform.isWebHosted = false;

        (getContext as jest.Mock).mockReturnValue(mockContext);
        (fsExistsSync as jest.Mock).mockReturnValue(true);

        // WHEN
        await copyBuildsFolder();

        // THEN
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledTimes(4);
    });
});
