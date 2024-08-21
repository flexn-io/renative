import { checkAndUpdateProjectIfRequired } from '../update';
import path from 'path';
import { logDefault, logError, logInfo } from '../../logger';
import { getContext } from '../../context/provider';
import { generateContextDefaults } from '../../context/defaults';
import { copyFileSync, fsExistsSync, fsLstatSync, readObjectSync, writeFileSync } from '../../system/fs';
import { inquirerPrompt } from '../../api';
import { RnvPlatform } from '../../types';

jest.mock('path');
jest.mock('../../api');
jest.mock('../../context/provider');
jest.mock('../../system/fs');
jest.mock('../../logger');
jest.mock('../../templates');

afterEach(() => {
    jest.resetAllMocks();
});

describe('checkAndUpdateProjectIfRequired', () => {
    it('should log default message and return if platform is not defined', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        //WHEN
        const result = await checkAndUpdateProjectIfRequired();
        //THEN
        expect(logDefault).toHaveBeenCalledWith('checkAndUpdateIfRequired');
        expect(result).toBeUndefined();
    });
    it('should return true if the project is a monorepo', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
        c.platform = 'ios';
        c.buildConfig.isMonorepo = true;
        //WHEN
        const result = await checkAndUpdateProjectIfRequired();
        //THEN
        expect(result).toBe(true);
        expect(inquirerPrompt).not.toHaveBeenCalled();
        expect(writeFileSync).not.toHaveBeenCalled();
    });

    it('should reject if platform is not supported', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
        c.platform = 'test' as RnvPlatform;
        c.buildConfig.isMonorepo = false;
        c.files.project.config = { defaults: { supportedPlatforms: ['ios'] } };
        c.paths.template.configTemplate = '/path/to/template';
        jest.mocked(readObjectSync).mockReturnValue({
            templateConfig: { includedPaths: [{ platforms: ['android'], paths: ['mockFile.js'] }] },
        });
        jest.mocked(inquirerPrompt).mockResolvedValue({ confirm: true });
        //WHEN
        await expect(checkAndUpdateProjectIfRequired()).rejects.toEqual('Platform test is not supported!');
        //THEN
        expect(logError).toHaveBeenCalledWith('Platform test is not supported!');
    });
    it('should reject if the user cancels the operation', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
        c.platform = 'android';
        c.buildConfig.isMonorepo = false;
        c.files.project.config = { defaults: { supportedPlatforms: ['ios'] } };
        c.paths.template.configTemplate = '/path/to/template';
        jest.mocked(readObjectSync).mockReturnValue({
            templateConfig: { includedPaths: [{ platforms: ['android'], paths: ['mockFile.js'] }] },
        });
        jest.mocked(inquirerPrompt).mockResolvedValue({ confirm: false });
        //WHEN
        //THEN
        await expect(checkAndUpdateProjectIfRequired()).rejects.toEqual('Cancelled by user');
    });
    it('should configure a new platform', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
        c.platform = 'android';
        c.buildConfig.isMonorepo = false;
        c.files.project.config = { defaults: { supportedPlatforms: ['ios'] } };
        c.paths.project.dir = '/project/dir';
        c.paths.project.config = '/project/dir/renative.json';
        c.paths.template.dir = '/template/dir';
        c.paths.template.configTemplate = '/path/to/template';
        jest.mocked(readObjectSync).mockReturnValue({
            templateConfig: { includedPaths: [{ platforms: ['android'], paths: ['mockFile.js'] }] },
        });
        jest.mocked(inquirerPrompt).mockResolvedValue({ confirm: true });
        jest.mocked(fsExistsSync).mockReturnValueOnce(false).mockReturnValueOnce(true);
        jest.mocked(fsLstatSync).mockReturnValue({ isDirectory: () => false } as any);
        jest.mocked(path.join).mockImplementation((...paths) => paths.join('/'));
        const sourcePath = path.join(c.paths.template.dir, 'mockFile.js');
        const destPath = path.join(c.paths.project.dir, 'mockFile.js');

        //WHEN
        await expect(checkAndUpdateProjectIfRequired()).resolves.toEqual(true);
        //THEN
        expect(writeFileSync).toHaveBeenCalledWith('/project/dir/renative.json', {
            defaults: { supportedPlatforms: ['ios', 'android'] },
        });
        expect(copyFileSync).toHaveBeenCalledWith(sourcePath, destPath);
        expect(logInfo).toHaveBeenCalledWith(expect.stringContaining('COPYING from TEMPLATE...DONE'));
    });
    it('should add missing files if a new platform was added to supportedPlatforms', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
        c.platform = 'android';
        c.buildConfig.isMonorepo = false;
        c.files.project.config = { defaults: { supportedPlatforms: ['ios', 'android'] } };
        c.paths.project.dir = '/project/dir';
        c.paths.project.config = '/project/dir/renative.json';
        c.paths.template.dir = '/template/dir';
        c.paths.template.configTemplate = '/path/to/template';
        jest.mocked(readObjectSync).mockReturnValue({
            templateConfig: { includedPaths: [{ platforms: ['android'], paths: ['mockFile.js'] }] },
        });
        jest.mocked(inquirerPrompt).mockResolvedValue({ confirm: true });
        jest.mocked(fsExistsSync).mockReturnValueOnce(false).mockReturnValueOnce(true);
        jest.mocked(fsLstatSync).mockReturnValue({ isDirectory: () => false } as any);
        jest.mocked(path.join).mockImplementation((...paths) => paths.join('/'));
        const sourcePath = path.join(c.paths.template.dir, 'mockFile.js');
        const destPath = path.join(c.paths.project.dir, 'mockFile.js');

        //WHEN
        await expect(checkAndUpdateProjectIfRequired()).resolves.toEqual(true);
        //THEN
        expect(writeFileSync).not.toHaveBeenCalled();
        expect(copyFileSync).toHaveBeenCalledWith(sourcePath, destPath);
        expect(logInfo).toHaveBeenCalledWith(expect.stringContaining('COPYING from TEMPLATE...DONE'));
    });
});
