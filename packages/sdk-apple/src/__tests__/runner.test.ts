import { inquirerPrompt, getContext, createRnvContext, logSuccess } from '@rnv/core';
import type { PromptParams } from '@rnv/core';
import { getIosDeviceToRunOn } from '../runner';
import { getAppleDevices } from '../deviceManager';
import { updateDefaultTargets } from '@rnv/sdk-utils';

const simJson = [
    {
        udid: '131BD0D2-8F85-4C34-83BB-C0A58E1B41B4',
        name: 'iPhone SE (3rd generation)',
        icon: 'Phone 📱',
        version: '17.0 (21A328)',
        modelName: 'iPhone SE (3rd generation)',
        isDevice: false,
    },
    {
        udid: 'F70567A3-1F90-4EA8-B788-B5C6926CEFAF',
        name: 'iPhone 15',
        icon: 'Phone 📱',
        version: '17.0 (21A328)',
        modelName: 'iPhone 15',
        isDevice: false,
    },
];
const devicesJson = [
    {
        udid: 'ABF470AF-2538-4047-94A8-D72E22EB15BF',
        name: 'iPhone 15',
        icon: 'Phone 📱',
        version: '17.0 (21A328)',
        modelName: 'iPhone 15',
        isDevice: true,
    },
];

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-utils');
jest.mock('../deviceManager');
jest.mock('chalk', () => ({
    bold: {
        white: jest.fn((str) => str),
    },
}));
beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('getIosDeviceToRunOn', () => {
    it('should return a device to run on with pick', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.runtime.isTargetTrue = true;
        ctx.platform = 'ios';
        jest.mocked(getAppleDevices).mockResolvedValueOnce(simJson);
        jest.mocked(inquirerPrompt).mockImplementation(async ({ type, name, choices }: PromptParams) => {
            if (type === 'confirm') {
                return {
                    [name as string]: true,
                };
            }

            if (type === 'list') {
                return {
                    [name as string]: (choices![1] as { name: string; value: any }).value || choices![1],
                };
            }
        });
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        //THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toBe('--simulator iPhone\\ 15');
    });

    it('should return undefined if target is undefined and no devices available', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        jest.mocked(getAppleDevices).mockResolvedValueOnce([]);
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        //THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toBe(undefined);
    });

    it('should return a device to run on without pick', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        jest.mocked(getAppleDevices).mockResolvedValueOnce(simJson);
        jest.mocked(inquirerPrompt).mockImplementation(async ({ type, name, choices }: PromptParams) => {
            if (type === 'confirm') {
                return {
                    [name as string]: true,
                };
            }
            if (type === 'list') {
                // By default first value returned (aka the first simulator from the list in this case)
                return {
                    [name as string]: (choices![0] as { name: string; value: any }).value || choices![0],
                };
            }
        });
        jest.mocked(updateDefaultTargets).mockImplementation(async (ctx, currentTarget) => {
            if (!ctx.platform) return;
            ctx.runtime.target = currentTarget;
        });
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        //THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toBe('--simulator iPhone\\ SE\\ (3rd\\ generation)');
    });

    it('should return the correct device when specified', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        ctx.runtime.target = 'iPhone 15';
        jest.mocked(getAppleDevices).mockResolvedValueOnce(simJson);
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        // THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toEqual('--simulator iPhone\\ 15');
    });
    it('should update the global default target when user opts in', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        ctx.files.workspace.config = {};
        ctx.runtime.target = 'iPhone 14';
        jest.mocked(getAppleDevices).mockResolvedValueOnce(simJson);
        jest.mocked(inquirerPrompt).mockImplementation(async ({ name, choices }: PromptParams) => {
            return {
                [name as string]: (choices![0] as { name: string; value: any }).value || choices![0],
            };
        });
        jest.mocked(updateDefaultTargets).mockImplementation(async (ctx, currentTarget) => {
            if (!ctx.platform) return;
            const configGlobal = ctx.files.workspace.config || {};
            configGlobal.defaultTargets = configGlobal.defaultTargets || {};
            configGlobal.defaultTargets[ctx.platform] = currentTarget;
            ctx.files.workspace.config = configGlobal;
            ctx.runtime.target = currentTarget;
        });
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        // THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toBe('--simulator iPhone\\ SE\\ (3rd\\ generation)');
        expect(ctx.files.workspace.config?.defaultTargets?.ios).toBe('iPhone SE (3rd generation)');
    });
    it('should ask from active devices and return a device if --device and --target are true', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        ctx.program.opts = jest.fn().mockReturnValue({ device: true, target: true });
        jest.mocked(getAppleDevices).mockResolvedValueOnce(devicesJson);
        jest.mocked(inquirerPrompt).mockImplementation(async ({ name, choices }: PromptParams) => {
            return { [name as string]: (choices![0] as { name: string; value: any }).value };
        });
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        // THEN

        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toBe('--udid ABF470AF-2538-4047-94A8-D72E22EB15BF');
    });
    it('should reject when -d and no devices are available', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        ctx.program.opts = jest.fn().mockReturnValue({ device: true });
        jest.mocked(getAppleDevices).mockResolvedValueOnce([]);
        // WHEN
        // THEN
        await expect(getIosDeviceToRunOn(ctx)).rejects.toMatch(`No ios devices connected!`);
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
    });
    it('should ask for sims and active devices and return the selected sim or device if -t is specified', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        ctx.program.opts = jest.fn().mockReturnValue({ target: true });
        jest.mocked(getAppleDevices).mockResolvedValueOnce([...devicesJson, ...simJson]);
        jest.mocked(inquirerPrompt).mockImplementation(async ({ name, choices }: PromptParams) => {
            return {
                [name as string]: (choices![0] as { name: string; value: any }).value || choices![0],
            };
        });
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        //THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toBe('--udid ABF470AF-2538-4047-94A8-D72E22EB15BF');
    });
    it('should return the active device if -t is the name of the active device', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        ctx.program.opts = jest.fn().mockReturnValue({ target: 'iPhone 15' });
        jest.mocked(getAppleDevices).mockResolvedValueOnce([...devicesJson, ...simJson]);
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        //THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(logSuccess).toHaveBeenCalledWith(
            `Found device connected! Device name: iPhone 15 udid: ABF470AF-2538-4047-94A8-D72E22EB15BF`
        );
        expect(deviceArgs).toBe('--udid ABF470AF-2538-4047-94A8-D72E22EB15BF');
    });
});
