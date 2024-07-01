import { checkAndCreateProjectPackage } from '../package';
import { getContext } from '../../context/provider';
import { fsExistsSync, fsWriteFileSync, readObjectSync, loadFile } from '../../system/fs';
import { logInfo } from '../../logger';

jest.mock('../../context/provider');
jest.mock('../../system/fs');
jest.mock('../../logger');

beforeEach(() => {
    jest.clearAllMocks();
});

const mockContext = {
    files: {
        project: {
            config: {
                projectName: 'test-project',
                projectVersion: '1.0.0',
                templateConfig: {
                    name: 'test-template',
                    version: '1.0.0',
                },
            },
        },
        rnvCore: {
            package: {
                version: '1.0.0',
            },
        },
    },
    paths: {
        project: {
            dir: '/path/to/project',
            package: '/path/to/package',
        },
        template: {
            configTemplate: '/path/to/template',
        },
    },
};

describe('package', () => {
    it('should check and create project package correctly', async () => {
        // GIVEN

        (getContext as jest.Mock).mockReturnValue(mockContext);
        (fsExistsSync as jest.Mock).mockReturnValue(false);
        (readObjectSync as jest.Mock).mockReturnValue({ templateConfig: { package_json: {} } });
        // WHEN
        const result = await checkAndCreateProjectPackage();
        // THEN
        expect(result).toBe(true);
        expect(logInfo).toHaveBeenCalledWith('Your /path/to/package is missing. CREATING...DONE');
        expect(fsWriteFileSync).toHaveBeenCalledWith('/path/to/package', expect.any(String));
        expect(loadFile).toHaveBeenCalledWith(mockContext.files.project, mockContext.paths.project, 'package');
    });
    it('should not create a new package when package already exists', async () => {
        // GIVEN
        (getContext as jest.Mock).mockReturnValue(mockContext);
        (fsExistsSync as jest.Mock).mockReturnValue(true); // Package already exists

        // WHEN
        const result = await checkAndCreateProjectPackage();

        // THEN
        expect(result).toBe(true);
        expect(logInfo).not.toHaveBeenCalledWith('Your /path/to/package is missing. CREATING...DONE');
        expect(fsWriteFileSync).not.toHaveBeenCalled();
        expect(loadFile).toHaveBeenCalledWith(mockContext.files.project, mockContext.paths.project, 'package');
    });
});
