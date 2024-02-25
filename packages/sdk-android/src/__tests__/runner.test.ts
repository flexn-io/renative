import { getAndroidDeviceToRunOn } from '../runner';
import { createRnvApi, createRnvContext, getContext } from '@rnv/core';

jest.mock('../deviceManager', () => {
    return {
        mockLaunchAndroidSimulator: jest.fn(),
        resetAdb: jest.fn(),
        connectToWifiDevice: jest.fn(),
        getAndroidTargets: jest.fn(),
        checkForActiveEmulator: jest.fn(),
        composeDevicesArray: jest.fn(),
        askForNewEmulator: jest.fn(),
    };
});

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('getAndroidDeviceToRunOn', () => {
    it('should return found sim if target is provided and found - npx rnv -p android -t <target>', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.target = 'existingTarget';
        ctx.runtime.target = 'defaultTarget';
        const mockFoundDevice = { name: 'existingTarget', isActive: true, udid: '' };
        const { getAndroidTargets } = require('../deviceManager');
        getAndroidTargets.mockResolvedValueOnce([mockFoundDevice]);
        //WHEN

        const result = await getAndroidDeviceToRunOn(ctx);
        //THEN
        expect(result).toEqual(mockFoundDevice);
    });
    // it('should ask from devices and sims if target is not provided - npx rnv -p android', async () => {
    //     //GIVEN
    //     const ctx = getContext();
    //     ctx.platform = 'android';
    //     ctx.program.target = false;
    //     ctx.runtime.target = 'defaultTarget';
    //     const mockDevicesAndEmulators = [
    //         { name: 'simulator1', udid: 'udid1', isActive: true },
    //         { name: 'simulator2', udid: 'udid2', isActive: false },
    //         // Add more mock targets as needed
    //     ];
    //     const { getAndroidTargets } = require('../deviceManager');
    //     getAndroidTargets.mockResolvedValueOnce(mockDevicesAndEmulators);
    //     //WHEN

    //     // const result = await getAndroidDeviceToRunOn(ctx);
    //     //THEN
    // });
});
