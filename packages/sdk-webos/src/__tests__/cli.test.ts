import * as installer from '../installer';
import * as core from '@rnv/core';
import { exec } from 'child_process';

jest.mock('@rnv/core', () => ({
    ...jest.requireActual('@rnv/core'),
    isSystemWin: true,
    getContext: jest.fn(),
    logDefault: jest.fn(),
    logError: jest.fn(),
    fsExistsSync: jest.fn(),
    getRealPath: jest.fn().mockImplementation((p) => p),
}));

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
    writeFileSync: jest.fn(),
}));

jest.mock('child_process', () => ({
    exec: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('checkAndConfigureWebosSdks', () => {
    it('throws an error if no WebOS SDK is found', async () => {
        const mockContext = {
            platform: 'webos',
            buildConfig: {
                sdks: {
                    WEBOS_SDK: '/path/to/sdk',
                },
            },
            cli: {},
        };

        (core.getContext as jest.Mock).mockReturnValue(mockContext);
        (core.fsExistsSync as jest.Mock).mockReturnValue(false);
        (exec as any).mockImplementation((cmd, callback) => callback(null, { stdout: '/path/to/cli' }));

        const reject = installer.checkAndConfigureWebosSdks();
        await expect(reject).rejects.toThrow('No Webos SDK found. Check if it is installed.');
    });
    it('checks for old version of CLI(installed manually and placed in SDK folder)', async () => {
        const mockContext = {
            platform: 'webos',
            buildConfig: {
                sdks: {
                    WEBOS_SDK: '/path/to/sdk',
                },
            },
            cli: {},
        };

        (core.getContext as jest.Mock).mockReturnValue(mockContext);
        (core.fsExistsSync as jest.Mock).mockReturnValue(true);
        (exec as any).mockImplementation((cmd, callback) => callback(null, { stdout: '/path/to/cli' }));

        await installer.checkAndConfigureWebosSdks();
        expect(core.getContext().cli).toHaveProperty('webosAres');
        expect(core.getContext().cli.webosAres).toContain('/path/to/sdk/CLI/bin/ares');
    });
    it('checks for new version of CLI(installed with npm)', async () => {
        const mockContext = {
            platform: 'webos',
            buildConfig: {
                sdks: {
                    WEBOS_SDK: '/path/to/sdk',
                },
            },
            cli: {},
        };

        (core.getContext as jest.Mock).mockReturnValue(mockContext);
        (exec as any).mockImplementation((cmd, callback) => callback(null, { stdout: '/path/to/cli' }));
        (core.fsExistsSync as jest.Mock).mockReturnValueOnce(true);
        (core.fsExistsSync as jest.Mock).mockReturnValueOnce(false);
        (core.fsExistsSync as jest.Mock).mockReturnValueOnce(true);

        await installer.checkAndConfigureWebosSdks();
        expect(core.getContext().cli).toHaveProperty('webosAres');
        expect(core.getContext().cli.webosAres).toContain('/path/to/ares');
    });
    it('correct path resolution for Windows', async () => {
        const mockContext = {
            platform: 'webos',
            buildConfig: {
                sdks: {
                    WEBOS_SDK: '/path/to/sdk',
                },
            },
            isSystemWin: true,
            cli: {},
        };
        expect(core.isSystemWin).toBe(true);

        (core.getContext as jest.Mock).mockReturnValue(mockContext);
        (exec as any).mockImplementation((cmd, callback) => callback(null, { stdout: '/path/to/cli' }));
        (core.fsExistsSync as jest.Mock).mockReturnValueOnce(true);
        (core.fsExistsSync as jest.Mock).mockReturnValueOnce(false);
        (core.fsExistsSync as jest.Mock).mockReturnValueOnce(true);

        await installer.checkAndConfigureWebosSdks();
        expect(core.getContext().cli).toHaveProperty('webosAres');
        expect(core.getContext().cli.webosAres).toContain('/path/to/ares');
    });
});
