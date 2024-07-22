import { createRnvContext, execCLI, getContext, logDebug } from '@rnv/core';
import semver from 'semver';
import { _checkAndConfigureTargetSdk, _formatObject, _getCliVersions } from '../taskEnvinfo';

jest.mock('@rnv/core');
jest.mock('semver');
jest.mock('envinfo', () => ({
    run: jest.fn(),
}));

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('_formatObject tests', () => {
    it('should format nested arrays correctly', () => {
        // GIVEN
        const obj = {
            key1: {
                key2: {
                    key3: ['item1', 'item2'],
                },
            },
        };
        // WHEN
        const result = _formatObject(obj);
        // THEN
        expect(result).toBe('\nkey1:\n  key2:\n    key3: item1, item2\n');
    });
    it('should format nested objects correctly', () => {
        // GIVEN
        const obj = {
            key1: {
                key2: {
                    key3: {
                        version: '1.0.0',
                        path: '/mocked/path',
                    },
                },
            },
        };
        // WHEN
        const result = _formatObject(obj);
        // THEN
        expect(result).toBe('\nkey1:\n  key2:\n    key3: 1.0.0 - /mocked/path\n');
    });
});

describe('_getCliVersions tests', () => {
    it('should add CLI versions to parsedInfo', async () => {
        // GIVEN
        const ctx = getContext();
        const cliVersionOutput = '1.0.0';
        const parsedInfo: { CLI?: any } = {};

        ctx.cli = {
            webosAres: '/path/to/webosAres',
            tizen: '/path/to/tizen',
        };

        jest.mocked(execCLI).mockResolvedValue(cliVersionOutput);
        semver.coerce = jest.fn().mockReturnValue({ version: '1.0.0' });
        //WHEN
        await _getCliVersions(parsedInfo);
        //THEN
        expect(execCLI).toHaveBeenCalledTimes(2);
        expect(parsedInfo).toHaveProperty('CLI');
        expect(parsedInfo.CLI).toHaveProperty('WEBOS CLI', { version: '1.0.0', path: '/path/to/webosAres' });
        expect(parsedInfo.CLI).toHaveProperty('TIZEN CLI', { version: '1.0.0', path: '/path/to/tizen' });
    });
    it('should not add CLI versions if no cli is present in context', async () => {
        // GIVEN
        const parsedInfo: { CLI?: any } = {};
        //WHEN
        await _getCliVersions(parsedInfo);
        //THEN
        expect(execCLI).not.toHaveBeenCalled();
        expect(parsedInfo.CLI).toBeUndefined();
    });
    it('should add only available CLI versions if one cli is present in context', async () => {
        // GIVEN
        const ctx = getContext();
        const cliVersionOutput = '1.0.0';
        const parsedInfo: { CLI?: any } = {};

        ctx.cli = {
            webosAres: '/path/to/webosAres',
        };
        jest.mocked(execCLI).mockResolvedValue(cliVersionOutput);
        semver.coerce = jest.fn().mockReturnValue({ version: '1.0.0' });
        //WHEN
        await _getCliVersions(parsedInfo);
        //THEN
        expect(execCLI).toHaveBeenCalledTimes(1);
        expect(parsedInfo).toHaveProperty('CLI');
        expect(parsedInfo.CLI).toHaveProperty('WEBOS CLI', { version: '1.0.0', path: '/path/to/webosAres' });
        expect(parsedInfo.CLI).not.toHaveProperty('TIZEN CLI');
    });

    it('should handle errors properly', async () => {
        // GIVEN
        const ctx = getContext();
        const parsedInfo: { CLI?: any } = {};
        ctx.cli = {
            webosAres: '/path/to/webosAres',
            tizen: '/path/to/tizen',
        };

        const error = new Error('Test error');

        jest.mocked(execCLI).mockRejectedValue(error);
        semver.coerce = jest.fn().mockReturnValue(null);

        //WHEN
        await _getCliVersions(parsedInfo);
        //THEN
        expect(execCLI).toHaveBeenCalledTimes(2);
        expect(parsedInfo.CLI).toBeUndefined();
        expect(logDebug).toHaveBeenCalledTimes(2);
        expect(logDebug).toHaveBeenLastCalledWith(`Error getting version for TIZEN CLI: `, error);
    });
});

describe('_checkAndConfigureTargetSdk tests', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    // GIVEN

    it('should call the SDK module function', async () => {
        // GIVEN
        const mockConfigureFunction = jest.fn();
        jest.mock(
            `@rnv/mockModule`,
            () => ({
                mockConfigureFunction,
            }),
            { virtual: true }
        );
        // WHEN
        await _checkAndConfigureTargetSdk('mockModule', 'mockConfigureFunction');

        //THEN
        expect(mockConfigureFunction).toHaveBeenCalled();
    });

    it('should handle error and log it if module is not found', async () => {
        // GIVEN
        const moduleName = 'nonExistentModule';
        const configureFunction = 'checkAndConfigureMockSdks';

        //WHEN
        await _checkAndConfigureTargetSdk(moduleName, configureFunction);

        // THEN
        expect(logDebug).toHaveBeenCalledTimes(1);
        expect(logDebug).toHaveBeenCalledWith(
            `Error configuring ${moduleName} SDK: `,
            expect.objectContaining({
                message: expect.stringContaining(`Cannot find module '@rnv/${moduleName}'`),
            })
        );
    });
    it('should handle error and log it if the configure function throws an error', async () => {
        jest.mock(
            '@rnv/mockModule',
            () => ({
                mockConfigureFunction: jest.fn().mockRejectedValue(new Error('Configuration error')),
            }),
            { virtual: true }
        );
        await _checkAndConfigureTargetSdk('mockModule', 'mockConfigureFunction');

        expect(logDebug).toHaveBeenCalledWith('Error configuring mockModule SDK: ', new Error('Configuration error'));
    });
});
