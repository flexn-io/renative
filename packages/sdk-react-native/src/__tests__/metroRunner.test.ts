import { createRnvContext, getContext, logInfo, chalk, executeAsync, logDefault, logRaw, logError } from '@rnv/core';
import { getEntryFile, confirmActiveBundler } from '@rnv/sdk-utils';
import { isBundlerActive } from '../common';
import { startReactNative } from '../metroRunner';
import { EnvVars } from '../env';

jest.mock('@rnv/core');
jest.mock('../common');
jest.mock('../env');
jest.mock('@rnv/sdk-utils');

beforeEach(() => {
    createRnvContext();
    jest.mocked(getEntryFile).mockReturnValue('index');
    jest.spyOn(EnvVars, 'RCT_NO_LAUNCH_PACKAGER').mockReturnValue({ RCT_NO_LAUNCH_PACKAGER: 1 });
});

afterEach(() => {
    jest.resetAllMocks();
});

const updateContext = () => {
    const ctx = getContext();
    ctx.platform = 'ios';
    ctx.runtime.port = 8081;
    ctx.runtime.localhost = 'localhost';
    ctx.program.opts = jest.fn().mockReturnValue({ reset: false, resetHard: false });
    return ctx;
};
describe('startReactNative tests', () => {
    it('should return false if platform is not defined', async () => {
        //GIVEN
        //WHEN
        const result = await startReactNative({});
        //THEN
        expect(logDefault).toHaveBeenCalledWith('startReactNative');
        expect(result).toBe(false);
    });
    it('should handle active bundler correctly when waitForBundler is true', async () => {
        //GIVEN
        updateContext();
        jest.mocked(isBundlerActive).mockResolvedValue(true);
        jest.mocked(confirmActiveBundler).mockResolvedValue(true);

        const expectedCommand = `npx react-native start --port 8081 --no-interactive`;
        //WHEN
        await startReactNative({ waitForBundler: true });
        //THEN
        expect(isBundlerActive).toHaveBeenCalled();
        expect(confirmActiveBundler).toHaveBeenCalled();
        expect(executeAsync).toHaveBeenCalledWith(
            expectedCommand,
            expect.objectContaining({
                env: expect.objectContaining({
                    RCT_NO_LAUNCH_PACKAGER: 1,
                }),
            })
        );
        expect(logRaw).toHaveBeenCalledWith(
            expect.stringContaining('Dev server running at: http://localhost:8081/index.bundle?platform=ios')
        );
    });

    it('should execute command with custom CLI path', async () => {
        //GIVEN
        updateContext();
        jest.mocked(isBundlerActive).mockResolvedValue(true);
        jest.mocked(confirmActiveBundler).mockResolvedValue(true);
        const customCliPath = '/custom/path/to/react-native-cli';
        const expectedCommand = `node ${customCliPath} start --port 8081 --no-interactive`;
        //WHEN
        await expect(startReactNative({ waitForBundler: true, customCliPath })).resolves.toEqual(undefined);
        //THEN
        expect(executeAsync).toHaveBeenCalledWith(
            expectedCommand,
            expect.objectContaining({
                env: expect.objectContaining({
                    RCT_NO_LAUNCH_PACKAGER: 1,
                }),
            })
        );
        expect(logRaw).toHaveBeenCalledWith(
            expect.stringContaining('Dev server running at: http://localhost:8081/index.bundle?platform=ios')
        );
    });
    it('should skip bundler checks and execute command when waitForBundler is false', async () => {
        //GIVEN
        updateContext();
        jest.mocked(executeAsync).mockResolvedValue('success');
        const expectedCommand = `npx react-native start --port 8081 --no-interactive`;
        //WHEN
        await expect(startReactNative({ waitForBundler: false })).resolves.toEqual(true);
        //THEN
        expect(isBundlerActive).not.toHaveBeenCalled();
        expect(confirmActiveBundler).not.toHaveBeenCalled();
        expect(executeAsync).toHaveBeenCalledWith(
            expectedCommand,
            expect.objectContaining({
                env: expect.not.objectContaining({
                    RCT_NO_LAUNCH_PACKAGER: 1,
                }),
            })
        );
        expect(logRaw).toHaveBeenCalledWith(
            expect.stringContaining('Dev server running at: http://localhost:8081/index.bundle?platform=ios')
        );
    });
    it('should execute command with metroConfigName and --reset-cache', async () => {
        //GIVEN
        const ctx = updateContext();
        ctx.program.opts = jest.fn().mockReturnValue({ reset: true });
        jest.mocked(executeAsync).mockResolvedValue('success');
        const metroConfigName = 'metro.config.js';
        const expectedCommand = `npx react-native start --port 8081 --no-interactive --config=${metroConfigName} --reset-cache`;
        //WHEN
        await startReactNative({ waitForBundler: false, metroConfigName });

        //THEN
        expect(executeAsync).toHaveBeenCalledWith(
            expectedCommand,
            expect.objectContaining({
                env: expect.not.objectContaining({
                    RCT_NO_LAUNCH_PACKAGER: 1,
                }),
            })
        );
        expect(logRaw).toHaveBeenCalledWith(
            expect.stringContaining('Dev server running at: http://localhost:8081/index.bundle?platform=ios')
        );
        expect(logInfo).toHaveBeenCalledWith(
            `You passed ${chalk().bold.white('-r')} argument. --reset-cache will be applied to react-native`
        );
    });
    it('should log error when executeAsync fails', async () => {
        //GIVEN
        updateContext();
        const expectedCommand = `npx react-native start --port 8081 --no-interactive`;
        const errorMessage = new Error('Something went wrong');
        jest.mocked(executeAsync).mockRejectedValue(errorMessage);
        //WHEN
        await expect(startReactNative({ waitForBundler: false })).resolves.toEqual(true);
        //THEN
        expect(isBundlerActive).not.toHaveBeenCalled();
        expect(confirmActiveBundler).not.toHaveBeenCalled();
        expect(executeAsync).toHaveBeenCalledWith(
            expectedCommand,
            expect.objectContaining({
                env: expect.not.objectContaining({
                    RCT_NO_LAUNCH_PACKAGER: 1,
                }),
            })
        );
        expect(logError).toHaveBeenCalledWith(errorMessage);
    });
});
