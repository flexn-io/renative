import { createRnvContext, getContext, getDirectories, getRealPath, inquirerPrompt } from '@rnv/core';
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

    it('should give log warning if target not found and resolve', async () => {
        //GIVEN
        const ctx = getContext();
        const target = '';
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(launchWebOSimulator).mockResolvedValue(true);

        //WHEN
        const result = await launchWebOSimulator(ctx, target);

        //THEN

        expect(RnvCore.logWarning).toHaveBeenCalled();
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [macos]', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.isSystemWin = false;
        const target = true;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        jest.mocked(RnvCore).isSystemMac = true;
        jest.mocked(RnvCore).isSystemLinux = false;

        //WHEN
        const result = await launchWebOSimulator(ctx, target);

        //THEN
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [linux]', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.isSystemWin = false;
        const target = true;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        jest.mocked(RnvCore).isSystemMac = false;
        jest.mocked(RnvCore).isSystemLinux = true;

        //WHEN
        const result = await launchWebOSimulator(ctx, target);

        //THEN
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [windows]', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;
        ctx.isSystemWin = true;

        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        jest.mocked(RnvCore).isSystemMac = false;
        jest.mocked(RnvCore).isSystemLinux = false;

        //WHEN
        const result = await launchWebOSimulator(ctx, target);

        //THEN
        expect(result).toEqual(true);
    });
});
