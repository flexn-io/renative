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
        ctx.platform = 'webos';
        ctx.paths.workspace.config = '/path/test/renative';
        const target = true;
        const errorMessage = `Your webos SDK path is not configured. If you want to run simulator please update your /path/test/renative file with simulator path.`;

        jest.mocked(getRealPath).mockReturnValue(undefined);

        //WHEN & THEN
        await expect(launchWebOSimulator(target)).rejects.toBe(errorMessage);
    });

    it('should give log warning if target not found and resolve', async () => {
        //GIVEN
        const ctx = getContext();
        const target = '';
        ctx.isSystemWin = false;
        ctx.isSystemMac = true;
        ctx.isSystemLinux = false;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);
        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        //WHEN
        const result = await launchWebOSimulator(target);

        //THEN
        expect(RnvCore.logWarning).toHaveBeenCalled();
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [macos]', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.isSystemWin = false;
        ctx.isSystemMac = true;
        ctx.isSystemLinux = false;
        const target = true;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        //WHEN
        const result = await launchWebOSimulator(target);

        //THEN
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [linux]', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.isSystemWin = false;
        ctx.isSystemMac = false;
        ctx.isSystemLinux = true;
        const target = true;
        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        //WHEN
        const result = await launchWebOSimulator(target);

        //THEN
        expect(result).toEqual(true);
    });

    it('should ask to select sims if no target is specified and run it [windows]', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;
        ctx.isSystemWin = true;
        ctx.isSystemMac = false;
        ctx.isSystemLinux = false;

        jest.mocked(getRealPath).mockReturnValue('mock_webos_SDK_path');
        jest.mocked(getDirectories).mockReturnValue(['mock_sim_1', 'mock_sim_2']);

        jest.mocked(inquirerPrompt).mockResolvedValue({ selectedSimulator: 'mock_sim_1' });

        //WHEN
        const result = await launchWebOSimulator(target);

        //THEN
        expect(result).toEqual(true);
    });
});
