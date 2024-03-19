import { createRnvContext, fsExistsSync, getContext, getDirectories, getRealPath, inquirerPrompt } from '@rnv/core';
import { launchWebOSimulator } from '../deviceManager';
import * as RnvCore from '@rnv/core';

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

        jest.mocked(getRealPath).mockReturnValue(undefined);

        //WHEN & THEN
        await expect(launchWebOSimulator(ctx, target)).rejects.toBe(errorMessage);
    });

    it('should ask to select sims if no target is specified and run it [macos]', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        jest.mocked(fsExistsSync).mockReturnValue(true);

        RnvCore.isSystemMac = true;
        RnvCore.isSystemWin = false;
        RnvCore.isSystemLinux = false;

        //WHEN
        const result = await launchWebOSimulator(ctx, target);

        //THEN
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [linux]', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        jest.mocked(fsExistsSync).mockReturnValue(true);

        RnvCore.isSystemMac = false;
        RnvCore.isSystemWin = false;
        RnvCore.isSystemLinux = true;

        //WHEN
        const result = await launchWebOSimulator(ctx, target);

        //THEN
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [windows]', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        jest.mocked(fsExistsSync).mockReturnValue(true);

        RnvCore.isSystemMac = false;
        RnvCore.isSystemWin = true;
        RnvCore.isSystemLinux = false;

        //WHEN
        const result = await launchWebOSimulator(ctx, target);

        //THEN
        expect(result).toEqual(true);
    });
});
