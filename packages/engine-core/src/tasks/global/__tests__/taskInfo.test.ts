import { createRnvContext, execCLI, getContext, logDebug, logToSummary, logError } from '@rnv/core';
import envinfo from 'envinfo';
import semver from 'semver';
import taskInfo from '../taskInfo';

jest.mock('@rnv/core');
jest.mock('semver');
jest.mock('envinfo', () => ({
    run: jest.fn(),
}));

beforeEach(() => {
    createRnvContext();
    jest.resetAllMocks();
    jest.resetModules();
});

describe('taskInfo tests', () => {
    it('Execute task.rnv.info', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.cli = {
            webosAres: '/path/to/webosAres',
            tizen: '/path/to/tizen',
        };
        const mockEnvInfo = { System: { OS: 'macOS', CPU: 'Intel' } };
        jest.mocked(envinfo.run).mockResolvedValue(JSON.stringify(mockEnvInfo));

        const mockCheckAndConfigure = jest.fn();
        jest.mock(
            '@rnv/sdk-tizen',
            () => ({
                checkAndConfigureTizenSdks: mockCheckAndConfigure,
            }),
            { virtual: true }
        );
        jest.mock(
            '@rnv/sdk-webos',
            () => ({
                checkAndConfigureWebosSdks: mockCheckAndConfigure,
            }),
            { virtual: true }
        );

        const mockExecCLI = jest.mocked(execCLI).mockResolvedValue('1.0.0');
        semver.coerce = jest.fn().mockReturnValue({ version: '1.0.0' });

        // WHEN
        await expect(
            taskInfo.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        // THEN
        expect(envinfo.run).toHaveBeenCalled();
        expect(mockCheckAndConfigure).toHaveBeenCalledTimes(2);
        expect(mockExecCLI).toHaveBeenCalledTimes(2);
        expect(logToSummary).toHaveBeenCalledWith(expect.stringContaining('System:\n  OS: macOS\n  CPU: Intel\n'));
        expect(logToSummary).toHaveBeenCalledWith(expect.stringContaining('WEBOS CLI: 1.0.0 - /path/to/webosAres\n'));
        expect(logToSummary).toHaveBeenCalledWith(expect.stringContaining('TIZEN CLI: 1.0.0 - /path/to/tizen\n'));
    });
    it('should handle errors when getting environment info', async () => {
        // GIVEN
        const ctx = getContext();
        const mockError = new Error('Test error');
        jest.mocked(envinfo.run).mockRejectedValue(mockError);
        //WHEN
        await expect(
            taskInfo.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        //THEN
        expect(logError).toHaveBeenCalledWith(mockError);
        expect(logToSummary).toHaveBeenCalledWith(expect.objectContaining(mockError));
    });
    it('should handle errors during SDK configuration', async () => {
        // GIVEN
        const ctx = getContext();
        const mockEnvInfo = { System: { OS: 'macOS', CPU: 'Intel' } };
        jest.mocked(envinfo.run).mockResolvedValue(JSON.stringify(mockEnvInfo));
        const cliVersionOutput = '1.0.0';
        ctx.cli = {
            webosAres: '/path/to/webosAres',
            tizen: '/path/to/tizen',
        };
        jest.mocked(execCLI).mockResolvedValue(cliVersionOutput);
        semver.coerce = jest.fn().mockReturnValue({ version: '1.0.0' });
        jest.mock(
            '@rnv/sdk-tizen',
            () => ({
                checkAndConfigureTizenSdks: jest.fn().mockRejectedValue(new Error('Tizen SDK error')),
            }),
            { virtual: true }
        );
        jest.mock(
            '@rnv/sdk-webos',
            () => ({
                checkAndConfigureWebosSdks: jest.fn(),
            }),
            { virtual: true }
        );

        // WHEN
        await expect(
            taskInfo.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        // THEN
        expect(envinfo.run).toHaveBeenCalled();
        expect(execCLI).toHaveBeenCalledTimes(2);
        expect(logDebug).toHaveBeenCalledWith('Error configuring sdk-tizen SDK: ', new Error('Tizen SDK error'));
        expect(logDebug).not.toHaveBeenCalledWith('Error configuring sdk-webos SDK: ', new Error('WebOS SDK error'));
        expect(logToSummary).toHaveBeenCalledWith(expect.stringContaining('System:\n  OS: macOS\n  CPU: Intel\n'));
        expect(logToSummary).toHaveBeenCalledWith(expect.stringContaining('WEBOS CLI: 1.0.0 - /path/to/webosAres\n'));
    });
    it('should handle error and log it if module is not found', async () => {
        // GIVEN
        const ctx = getContext();
        const mockEnvInfo = { System: { OS: 'macOS', CPU: 'Intel' } };
        jest.mocked(envinfo.run).mockResolvedValue(JSON.stringify(mockEnvInfo));
        const cliVersionOutput = '1.0.0';
        const errorMessage = `Cannot find module '@rnv/sdk-tizen'`;
        ctx.cli = {
            webosAres: '/path/to/webosAres',
        };
        jest.mocked(execCLI).mockResolvedValue(cliVersionOutput);
        semver.coerce = jest.fn().mockReturnValue({ version: '1.0.0' });
        jest.mock(
            '@rnv/sdk-tizen',
            () => {
                throw new Error(errorMessage);
            },
            { virtual: true }
        );
        jest.mock(
            '@rnv/sdk-webos',
            () => ({
                checkAndConfigureWebosSdks: jest.fn(),
            }),
            { virtual: true }
        );

        // WHEN
        await expect(
            taskInfo.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        // THEN
        expect(envinfo.run).toHaveBeenCalled();
        expect(execCLI).toHaveBeenCalledTimes(1);
        expect(logDebug).toHaveBeenCalledWith(
            `Error configuring sdk-tizen SDK: `,
            expect.objectContaining({
                message: expect.stringContaining(errorMessage),
            })
        );
        expect(logToSummary).toHaveBeenCalledWith(expect.stringContaining('System:\n  OS: macOS\n  CPU: Intel\n'));
        expect(logToSummary).toHaveBeenCalledWith(expect.stringContaining('WEBOS CLI: 1.0.0 - /path/to/webosAres\n'));
    });
});
