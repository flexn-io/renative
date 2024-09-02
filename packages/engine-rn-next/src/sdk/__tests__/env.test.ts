import { createRnvContext, fsExistsSync, getConfigProp, getContext, logWarning, parsePlugins } from '@rnv/core';
import { EnvVars } from '../env';
import { getExportDir } from '../runner';

jest.mock('@rnv/core');
jest.mock('path');
jest.mock('../runner');

describe('EnvVars', () => {
    beforeEach(() => {
        createRnvContext();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('RNV_NEXT_TRANSPILE_MODULES', () => {
        it('should return an empty array when no modules are configured', () => {
            // GIVEN
            jest.mocked(getConfigProp).mockReturnValueOnce(undefined);
            //WHEN
            const result = EnvVars.RNV_NEXT_TRANSPILE_MODULES();
            //THEN
            expect(result.RNV_NEXT_TRANSPILE_MODULES).toEqual([]);
        });

        it('should return configured modules', () => {
            // GIVEN

            const modules = ['module1', 'module2'];
            jest.mocked(getConfigProp).mockReturnValueOnce(modules);
            //WHEN
            const result = EnvVars.RNV_NEXT_TRANSPILE_MODULES();
            //THEN
            expect(result.RNV_NEXT_TRANSPILE_MODULES).toEqual(modules);
        });

        it('should return modules from plugins', () => {
            // GIVEN
            const ctx = getContext();
            const plugins = {
                plugin1: { webpackConfig: { nextTranspileModules: ['module3'] } },
            };
            ctx.paths.project.dir = '/path/to/project';
            ctx.platform = 'web';
            ctx.buildConfig.plugins = plugins;

            jest.mocked(getConfigProp).mockReturnValueOnce(undefined);
            jest.mocked(parsePlugins).mockImplementationOnce((cb) => {
                Object.keys(plugins).forEach((key) => {
                    cb(plugins[key], {}, key);
                });
            });
            //WHEN
            const result = EnvVars.RNV_NEXT_TRANSPILE_MODULES();
            //THEN
            expect(result.RNV_NEXT_TRANSPILE_MODULES).toEqual(['plugin1', 'module3']);
        });
    });

    describe('NEXT_BASE', () => {
        it('should return NEXT_BASE variables', () => {
            //GIVEN
            const ctx = getContext();
            ctx._currentTask = 'export';
            const pagesDir = 'custom/pages';
            jest.mocked(getConfigProp).mockReturnValueOnce(pagesDir);
            jest.mocked(fsExistsSync).mockReturnValueOnce(true);
            jest.mocked(getExportDir).mockReturnValue('/path/to/export');
            //WHEN
            const result = EnvVars.NEXT_BASE();
            //THEN
            expect(result).toEqual({
                NEXT_PAGES_DIR: pagesDir,
                NEXT_DIST_DIR: '/path/to/export',
                NEXT_EXPORT: true,
            });
        });

        it('should log warning if custom pagesDir does not exist', () => {
            //GIVEN
            const ctx = getContext();
            ctx._currentTask = 'export';
            const pagesDir = 'custom/pages';
            jest.mocked(getConfigProp).mockReturnValueOnce(pagesDir);
            jest.mocked(fsExistsSync).mockReturnValueOnce(false);
            jest.mocked(getExportDir).mockReturnValue('/path/to/export');
            //WHEN
            const result = EnvVars.NEXT_BASE();
            //THEN
            expect(logWarning).toHaveBeenCalledWith(expect.stringContaining('missing at'));
            expect(result).toEqual({
                NEXT_PAGES_DIR: pagesDir,
                NEXT_DIST_DIR: '/path/to/export',
                NEXT_EXPORT: true,
            });
        });

        it('should log warning if pagesDir is not configured and use fallback', () => {
            //GIVEN
            const ctx = getContext();
            ctx.platform = 'web';
            ctx._currentTask = 'export';
            jest.mocked(getConfigProp).mockReturnValueOnce(undefined);
            jest.mocked(fsExistsSync).mockReturnValueOnce(true);
            jest.mocked(getExportDir).mockReturnValue('/path/to/export');
            //WHEN
            const result = EnvVars.NEXT_BASE();
            //THEN
            expect(logWarning).toHaveBeenCalledWith(
                expect.stringContaining("You're missing web.pagesDir config. Defaulting to 'src/app'")
            );
            expect(result).toEqual({
                NEXT_PAGES_DIR: 'src/app',
                NEXT_DIST_DIR: '/path/to/export',
                NEXT_EXPORT: true,
            });
        });

        it('should log warning if fallback pagesDir does not exist', () => {
            //GIVEN
            const ctx = getContext();
            ctx.platform = 'web';
            ctx._currentTask = 'export';
            jest.mocked(getConfigProp).mockReturnValueOnce(undefined);
            jest.mocked(fsExistsSync).mockReturnValueOnce(false);
            jest.mocked(getExportDir).mockReturnValue('/path/to/export');
            //WHEN
            const result = EnvVars.NEXT_BASE();
            //THEN
            expect(logWarning).toHaveBeenCalledWith(expect.stringContaining('Folder src/app is missing'));
            expect(result).toEqual({
                NEXT_PAGES_DIR: 'src/app',
                NEXT_DIST_DIR: '/path/to/export',
                NEXT_EXPORT: true,
            });
        });
    });

    describe('NODE_ENV', () => {
        it('should return NODE_ENV from config', () => {
            //GIVEN
            const env = 'production';
            jest.mocked(getConfigProp).mockReturnValueOnce(env);
            //WHEN
            const result = EnvVars.NODE_ENV();
            //THEN
            expect(result.NODE_ENV).toEqual(env);
        });

        it('should return development if NODE_ENV is not configured', () => {
            //GIVEN
            jest.mocked(getConfigProp).mockReturnValueOnce(undefined);
            //WHEN
            const result = EnvVars.NODE_ENV();
            //THEN
            expect(result.NODE_ENV).toEqual('development');
        });
    });
});
