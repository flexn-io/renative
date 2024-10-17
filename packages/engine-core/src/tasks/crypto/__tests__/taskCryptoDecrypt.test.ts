import task from '../taskCryptoDecrypt';
import tar from 'tar';
import {
    logWarning,
    logSuccess,
    getRealPath,
    removeFilesSync,
    fsExistsSync,
    inquirerPrompt,
    createRnvContext,
} from '@rnv/core';
import { getEnvVar } from '../common';
import { getContext } from '../../../getContext';
import path from 'path';

const iocane = require('iocane');

jest.mock('@rnv/core');
jest.mock('tar', () => ({
    x: jest.fn(),
}));
jest.mock('iocane');
jest.mock('chalk', () => ({
    bold: {
        white: jest.fn((str) => str),
    },
    green: jest.fn((str) => str),
    yellow: jest.fn((str) => str),
}));
jest.mock('../common');
jest.mock('path', () => ({
    ...jest.requireActual('path'),
    join: jest.fn((...paths) => {
        return paths.join('/');
    }),
}));

const updateContext = () => {
    const ctx = getContext();
    ctx.paths.workspace.dir = 'workspace/path/.rnv';
    ctx.files.project.config = {
        project: { projectName: 'testProject', crypto: { path: './secrets/privateConfigs.enc' } },
    };
    ctx.command = 'crypto';
    ctx.paths.project.dir = 'project/path';
    ctx.files.project.config_original = { project: {} };
    ctx.program.opts = jest.fn().mockReturnValue({ key: 'testKey', reset: false, ci: false });
    return ctx;
};

beforeEach(() => {
    createRnvContext();
    iocane.createSession.mockReturnValue({
        use: jest.fn().mockReturnValue({
            decrypt: jest.fn().mockResolvedValue('decryptedData'),
        }),
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('taskCryptoDecrypt tests', () => {
    it('should log warning if crypto.path is missing', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.files.project.config = {
            project: { projectName: '@rnv/testProject' },
        };
        // WHEN
        // THEN
        await expect(
            task.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        expect(logWarning).toHaveBeenCalledWith(
            expect.stringContaining(`You don't have {{ crypto.path }} specificed in`)
        );
    });
    it('should prompt user if decrypted file already exists and use existing file if confirmed', async () => {
        const ctx = updateContext();
        const decryptedFilePath = path.join(
            ctx.paths.workspace.dir,
            `${ctx.files.project.config?.project?.projectName}.tgz`
        );
        jest.mocked(getEnvVar).mockReturnValue('CRYPTO_RNV_TESTPROJECT');
        jest.mocked(fsExistsSync).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
        jest.mocked(inquirerPrompt).mockResolvedValue({ confirm: true });
        jest.mocked(getRealPath).mockReturnValue(`${ctx.paths.project.dir}/secrets/privateConfigs.enc`);
        await expect(
            task.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        expect(inquirerPrompt).toHaveBeenCalledWith({
            type: 'confirm',
            message: `Found existing decrypted file at ${decryptedFilePath}. want to use it and skip decrypt ?`,
        });
        expect(tar.x).toHaveBeenCalledWith({
            file: decryptedFilePath,
            cwd: ctx.paths.workspace.dir,
        });
        expect(removeFilesSync).toHaveBeenCalledWith([decryptedFilePath]);
        expect(logSuccess).toHaveBeenCalledWith(
            `Files successfully extracted into ${ctx.paths.workspace.dir}/${ctx.files.project.config?.project?.projectName}`
        );
    });
    it('should prompt user if decrypted folder already exists and skip decryption if user selects skip option', async () => {
        //GIVEN
        const ctx = updateContext();
        jest.mocked(getEnvVar).mockReturnValue('CRYPTO_RNV_TESTPROJECT');
        jest.mocked(fsExistsSync).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false);
        jest.mocked(inquirerPrompt).mockResolvedValue({ option: 'Skip' });
        //WHEN
        //THEN
        await expect(
            task.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).resolves.toEqual(true);
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'option',
            type: 'list',
            choices: ['Yes - override (recommended)', 'Yes - merge', 'Skip'],
            message: `How to decrypt to ${ctx.paths.workspace.dir}/${ctx.files.project.config?.project?.projectName} ?`,
        });
    });

    it('should handle invalid decryption key', async () => {
        jest.resetAllMocks();
        //GIVEN
        const ctx = updateContext();
        jest.mocked(getEnvVar).mockReturnValue('CRYPTO_RNV_TESTPROJECT');
        jest.mocked(fsExistsSync).mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true);
        jest.mocked(getRealPath).mockReturnValue(`${ctx.paths.project.dir}/secrets/privateConfigs.enc`);
        const decryptMock = jest.fn().mockRejectedValue(new Error('Authentication failed'));
        iocane.createSession.mockReturnValue({
            use: jest.fn().mockReturnValue({
                decrypt: decryptMock,
            }),
        });
        //WHEN
        //THEN
        await expect(
            task.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).rejects.toEqual(expect.stringContaining('It seems like you provided invalid decryption key.'));
    });
    it('should reject if key is not provided', async () => {
        jest.resetAllMocks();
        //GIVEN
        const ctx = updateContext();
        ctx.program.opts = jest.fn().mockReturnValue({});
        jest.mocked(getEnvVar).mockReturnValue('CRYPTO_RNV_TESTPROJECT');
        jest.mocked(getRealPath).mockReturnValue(`${ctx.paths.project.dir}/secrets/privateConfigs.enc`);
        //WHEN
        //THEN
        await expect(
            task.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).rejects.toEqual(expect.stringContaining('encrypt: You must pass --key or have env var defined:'));
    });
    it('should reject if source file does not exist', async () => {
        //GIVEN
        const ctx = updateContext();
        jest.mocked(getEnvVar).mockReturnValue('CRYPTO_RNV_TESTPROJECT');
        jest.mocked(fsExistsSync).mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);
        jest.mocked(getRealPath).mockReturnValue(`${ctx.paths.project.dir}/secrets/privateConfigs.enc`);
        //WHEN
        //THEN
        await expect(
            task.fn?.({
                ctx,
                taskName: 'MOCK_taskName',
                originTaskName: 'MOCK_originTaskName',
                parentTaskName: 'MOCK_parentTaskName',
                shouldSkip: false,
            })
        ).rejects.toEqual(
            expect.stringContaining(`Can't decrypt. ${ctx.paths.project.dir}/secrets/privateConfigs.enc is missing!`)
        );
    });
});
