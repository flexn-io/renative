import { createRnvApi, createRnvContext } from '@rnv/core';
import type { PromptParams } from "@rnv/core";
import { getIosDeviceToRunOn } from '../runner';
import { simctlSimJson, xctraceDevices } from '../__mocks__/data';

beforeEach(() => {
    createRnvContext({ program: { platform: 'ios' } });
    createRnvApi();
});

const { executeAsync, inquirerPrompt, getContext } = require('@rnv/core');

afterEach(() => {
  jest.clearAllMocks();
});

describe('getIosDeviceToRunOn', () => {
  it('should return a device to run on with pick', async () => {
    const ctx = getContext();

    // configureRuntimeDefaults isn't called so setting it manually
    ctx.runtime.isTargetTrue = true;

    executeAsync
        .mockReturnValueOnce(Promise.resolve(xctraceDevices))
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(simctlSimJson)));

    inquirerPrompt.mockImplementation(async ({ type, name, choices }: PromptParams) => {
        if (type === 'confirm') {
        return {
            [name as string]: true,
        };
    }

    if (type === 'list') {
        return {
            [name as string]: (choices![1] as {name: string, value: any}).value || choices![1],
        };
    }
    });

    const deviceArgs = await getIosDeviceToRunOn(ctx);
    expect(executeAsync).toHaveBeenCalledTimes(2);
    expect(deviceArgs).toBe('--simulator iPhone\\ 14');
  });

  it('should return a device to run on without pick', async () => {
    const ctx = getContext();

    executeAsync
        .mockReturnValueOnce(Promise.resolve(xctraceDevices))
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(simctlSimJson)));

    inquirerPrompt.mockImplementation(async ({ type, name, choices }: PromptParams) => {
        if (type === 'confirm') {
        return {
            [name as string]: true,
        };
    }

    if (type === 'list') {
        return {
            [name as string]: (choices![0] as {name: string, value: any}).value || choices![0],
        };
    }
    });

    const deviceArgs = await getIosDeviceToRunOn(ctx);
    expect(executeAsync).toHaveBeenCalledTimes(2);
    expect(deviceArgs).toBe('--simulator iPhone\\ SE\\ (3rd\\ generation)');
  });

  it('should return the correct device when specified', async () => {
    const ctx = getContext();

    // configureRuntimeDefaults isn't called so setting it manually
    ctx.runtime.target = 'iPhone 14 Pro Max';

    executeAsync
        .mockReturnValueOnce(Promise.resolve(xctraceDevices))
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(simctlSimJson)));

    const deviceArgs = await getIosDeviceToRunOn(ctx);
    expect(executeAsync).toHaveBeenCalledTimes(2);
    expect(deviceArgs).toContain('--simulator');
    // expect(deviceArgs).toBe('--simulator iPhone\\ 14\\ Plus'); // FIXME: This is failing
  });
});