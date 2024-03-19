import { createRnvContext, fsExistsSync, getContext, getDirectories, getRealPath, inquirerPrompt } from '@rnv/core';
import { launchWebOSimulator } from '../deviceManager';

jest.mock('@rnv/core');
jest.mock('path');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('launchWebOSimulator', () => {
    it('should fail if webos SDK path is not defined', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;
        const errorMessage = `c.buildConfig.sdks.WEBOS_SDK undefined`;

        //WHEN
        jest.mocked(getRealPath).mockReturnValue(undefined);

        //THEN
        await expect(launchWebOSimulator(ctx, target)).rejects.toBe(errorMessage);
    });

    it('should ask to select sims if no target is specified and run it [macos]', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;

        //WHEN
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        // path.join.mockReturnValue('false');
        jest.mocked(fsExistsSync).mockReturnValue(true);

        jest.mock('@rnv/core', () => ({ isSystemWin: false, isSystemLinux: false }));

        //THEN
        const result = await launchWebOSimulator(ctx, target);
        expect(result).toEqual(true);
    });
});
