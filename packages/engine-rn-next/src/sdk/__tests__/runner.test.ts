import path from 'path';
import { buildWebNext, exportWebNext, runWebNext } from '../runner';
import { checkPortInUse, confirmActiveBundler, getDevServerHost, waitForHost } from '@rnv/sdk-utils';
import {
    getContext,
    getConfigProp,
    logDefault,
    logInfo,
    logSummary,
    createRnvContext,
    logRaw,
    executeAsync,
    logSuccess,
    chalk,
} from '@rnv/core';

jest.mock('../env');
jest.mock('@rnv/core');
jest.mock('path');

jest.mock('chalk', () => ({
    bold: {
        white: jest.fn((str) => str),
    },
    cyan: jest.fn((str) => str),
}));

beforeEach(() => {
    createRnvContext();
    jest.mocked(getDevServerHost).mockReturnValue('localhost');
    jest.mocked(path.join).mockReturnValue('/path/to/next');
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('runWebNext', () => {
    it('should return if platform is not defined', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.runtime.port = 3000;
        //WHEN
        await runWebNext();
        //THEN
        expect(logDefault).toHaveBeenCalledWith('runWebNext', 'port:3000');
        expect(checkPortInUse).not.toHaveBeenCalled();
    });
    it('should start dev server if port is not in use', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'web';
        ctx.runtime.port = 3000;
        ctx.runtime.shouldOpenBrowser = true;
        ctx.paths.project.dir = '/path/to/project';
        jest.mocked(checkPortInUse).mockResolvedValue(false);
        jest.mocked(getConfigProp).mockReturnValue(false);
        jest.mocked(waitForHost).mockResolvedValue(undefined);

        //WHEN
        await runWebNext();

        //THEN
        expect(logInfo).toHaveBeenCalledWith(
            'Your web devServerHost localhost at port 3000 is not running. Starting it up for you...'
        );
        expect(logSummary).toHaveBeenCalledWith({ header: 'BUNDLER STARTED' });
        expect(logRaw).toHaveBeenCalledWith(expect.stringContaining('Dev server running at: http://localhost:3000'));
        expect(executeAsync).toHaveBeenCalledWith(
            expect.stringContaining('node "/path/to/next" dev --port 3000'),
            expect.any(Object)
        );
    });
    it('should handle active bundler when port is in use and reset is completed', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'web';
        ctx.runtime.port = 3000;
        ctx.runtime.shouldOpenBrowser = true;
        ctx.paths.project.dir = '/path/to/project';
        jest.mocked(checkPortInUse).mockResolvedValue(true);
        jest.mocked(confirmActiveBundler).mockResolvedValue(true);
        jest.mocked(getConfigProp).mockReturnValue(false);
        jest.mocked(waitForHost).mockResolvedValue(undefined);

        //WHEN
        await runWebNext();

        //THEN
        expect(confirmActiveBundler).toHaveBeenCalled();
        expect(logSummary).toHaveBeenCalledWith({ header: 'BUNDLER STARTED' });
        expect(logRaw).toHaveBeenCalledWith(`
Dev server running at: ${chalk().cyan(`http://localhost:${ctx.runtime.port}`)}
`);
        expect(executeAsync).toHaveBeenCalledWith(
            expect.stringContaining('node "/path/to/next" dev --port 3000'),
            expect.any(Object)
        );
    });
});

describe('buildWebNext', () => {
    it('should build the project and log success message', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.paths.project.dir = '/path/to/project';
        const buildLocation = `${ctx.paths.project.dir}/output`;
        jest.mocked(getConfigProp).mockReturnValue(buildLocation);
        jest.mocked(path.isAbsolute).mockReturnValue(false);
        // WHEN
        await expect(buildWebNext()).resolves.toEqual(true);

        // THEN
        expect(logDefault).toHaveBeenCalledWith('buildWebNext');
        expect(executeAsync).toHaveBeenCalledWith(
            expect.stringContaining('node /path/to/next build'),
            expect.any(Object)
        );
        expect(logSuccess).toHaveBeenCalledWith(`Your build is located in ${chalk().cyan(`${buildLocation}`)} .`);
    });
});

describe('exportWebNext', () => {
    it('should export the project and log success message', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.paths.project.dir = '/path/to/project';
        const buildLocation = `${ctx.paths.project.dir}/output`;
        jest.mocked(getConfigProp).mockReturnValue(buildLocation);
        jest.mocked(path.isAbsolute).mockReturnValue(false);
        // WHEN
        await exportWebNext();
        // THEN
        expect(logDefault).toHaveBeenCalledWith('exportWebNext');
        expect(executeAsync).toHaveBeenCalledWith(
            expect.stringContaining('node /path/to/next build'),
            expect.objectContaining({
                env: expect.objectContaining({
                    NODE_ENV: 'production',
                }),
            })
        );
        expect(logSuccess).toHaveBeenCalledWith(`Your export is located in ${chalk().cyan(`${buildLocation}`)} .`);
    });
});
