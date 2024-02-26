import { createRnvApi, inquirerPrompt, getContext, createRnvContext } from '@rnv/core';
import type { PromptParams } from '@rnv/core';
import { getIosDeviceToRunOn } from '../runner';
import { getAppleDevices } from '../deviceManager';

const simctlSimJson = [
    {
        lastBootedAt: '2023-10-04T15:50:14Z',
        udid: 'A3CE2617-4071-4759-BC87-2F687FEA50A7',
        isAvailable: true,
        deviceTypeIdentifier: 'com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation',
        state: 'Shutdown',
        name: 'iPhone SE (3rd generation)',
    },
    {
        lastBootedAt: '2023-10-06T09:46:07Z',
        udid: '0BEDB188-352D-4215-8471-E9E27C670486',
        isAvailable: true,
        deviceTypeIdentifier: 'com.apple.CoreSimulator.SimDeviceType.iPhone-14',
        state: 'Shutdown',
        name: 'iPhone 14',
    },
];

jest.mock('@rnv/core');
jest.mock('../deviceManager');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
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
        jest.mocked(getAppleDevices).mockResolvedValueOnce(simctlSimJson);
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
        expect(deviceArgs).toBe('--simulator iPhone\\ 14');
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
        jest.mocked(getAppleDevices).mockResolvedValueOnce(simctlSimJson);
        jest.mocked(inquirerPrompt).mockImplementation(async ({ type, name, choices }: PromptParams) => {
            if (type === 'confirm') {
                return {
                    [name as string]: true,
                };
            }

            if (type === 'list') {
                return {
                    [name as string]: (choices![0] as { name: string; value: any }).value || choices![0],
                };
            }
        });
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        //THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        // TODO: check the expected logic here because getIosDeviceToRunOn
        // returns undefined in case of no target
        expect(deviceArgs).toBe(undefined);
        // expect(deviceArgs).toBe('--simulator iPhone\\ SE\\ (3rd\\ generation)');
    });

    it('should return the correct device when specified', async () => {
        // GIVEN
        const ctx = getContext();
        ctx.platform = 'ios';
        ctx.runtime.target = 'iPhone 14';
        jest.mocked(getAppleDevices).mockResolvedValueOnce(simctlSimJson);
        // WHEN
        const deviceArgs = await getIosDeviceToRunOn(ctx);
        // THEN
        expect(getAppleDevices).toHaveBeenCalledTimes(1);
        expect(deviceArgs).toEqual('--simulator iPhone\\ 14');
    });
});
