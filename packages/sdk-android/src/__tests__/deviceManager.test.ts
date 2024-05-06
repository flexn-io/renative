import { createRnvContext, execCLI, getContext, inquirerPrompt } from '@rnv/core';
import * as deviceManager from '../deviceManager';
import { AndroidDevice } from '../types';

jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('composeDevicesString', () => {
    it('return empty string if there is no devices', async () => {
        //GIVEN
        const devicesArray: Array<AndroidDevice> = [];
        //WHEN
        const result = deviceManager.composeDevicesString(devicesArray);

        //THEN
        expect(result).toEqual('\n');
    });
    it('return devices string if there are devices', async () => {
        //GIVEN
        const devicesArray: Array<AndroidDevice> = [];
        const device1: AndroidDevice = {
            udid: 'unknown',
            isActive: false,
            name: 'MockDevice1',
        };
        devicesArray.push(device1);
        //WHEN
        const result = deviceManager.composeDevicesString(devicesArray);

        //THEN
        expect(result).toEqual('\n [1]> MockDevice1 |  | arch: undefined | udid: unknown \n');
    });
});

describe('composeDevicesArray', () => {
    it('return empty array if there is no devices', async () => {
        //GIVEN
        const devicesArray: Array<AndroidDevice> = [];
        //WHEN
        const result = deviceManager.composeDevicesArray(devicesArray);

        //THEN
        expect(result).toEqual([]);
    });
    it('return devices aray if there are devices', async () => {
        //GIVEN
        const devicesArray: Array<AndroidDevice> = [];
        const device1: AndroidDevice = {
            udid: 'unknown',
            isActive: false,
            name: 'MockDevice1',
        };
        devicesArray.push(device1);

        const expectedResult = Array({
            icon: '',
            key: 'MockDevice1',
            name: 'MockDevice1 |  | arch: undefined | udid: unknown ',
            value: 'MockDevice1',
        });
        //WHEN
        const result = deviceManager.composeDevicesArray(devicesArray);

        //THEN
        expect(result).toEqual(expectedResult);
    });
});

describe('listAndroidTargets', () => {
    it('return list of android targets', async () => {
        //GIVEN
        const mockFoundDeviceList = [{ name: 'simulator1', isActive: false, udid: '', isDevice: false }];
        const ctx = getContext();
        ctx.program.opts().device = 'device1';

        const spy1 = jest.spyOn(deviceManager, 'getAndroidTargets').mockResolvedValue(mockFoundDeviceList);
        const spy2 = jest
            .spyOn(deviceManager, 'composeDevicesString')
            .mockReturnValue('\n [1]> simulator1 | Phone 📱  | arch: undefined | udid:  \n');
        //WHEN
        const result = await deviceManager.listAndroidTargets();

        //THEN
        expect(result).toEqual('\n [1]> simulator1 | Phone 📱  | arch: undefined | udid:  \n');
        spy1.mockRestore();
        spy2.mockRestore();
    });
});

//Need more tests
describe('launchAndroidSimulator', () => {
    it('launch simulator with empty target name', async () => {
        //GIVEN
        const errorMessage = 'No simulator -t target name specified!';
        //WHEN
        //THEN
        expect(deviceManager.launchAndroidSimulator('')).rejects.toBe(errorMessage);
    });
    it('launch simulator when given target name', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.opts().target = undefined;
        ctx.runtime.target = 'defaultTarget';
        ctx.program.opts().device = 'device1';

        const mockFoundDevice = { name: 'mock_sim_1', isActive: false, udid: '', isDevice: false };
        const spy1 = jest.spyOn(deviceManager, 'getAndroidTargets').mockResolvedValue([mockFoundDevice]);
        //WHEN
        const result = await deviceManager.launchAndroidSimulator('mock_sim_1');

        //THEN
        expect(result).toEqual(true);
        spy1.mockRestore();
    });
});

describe('resetAdb', () => {
    it('reset android debug bridge ', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.program.opts().resetAdb = true;
        //WHEN
        await deviceManager.resetAdb();

        //THEN
        expect(execCLI).toHaveBeenCalledTimes(2);
    });
});

//need deeper mocking...
// describe('getAndroidTargets', () => {
//     it('return list of android targets', async () => {
//         //GIVEN
//         const ctx = getContext();
//         ctx.program.opts().device = 'device1';
//         ctx.program.opts().skipTargetCheck = false;
//         ctx.platform = 'android';
//         jest.mocked(execCLI)
//             .mockImplementation()
//             .mockResolvedValueOnce('List of devices attached\n')
//             .mockResolvedValueOnce('android_mock_phone\n' + 'android_mock_tv\n' + 'ios_mock_phone\n' + 'Wear_OS');

//         //WHEN
//         const result = await deviceManager.getAndroidTargets(false, false);

//         //THEN
//         expect(result).toBe([]);
//         expect(execCLI).toHaveBeenCalledTimes(2);
//     });
// });

describe('connectToWifiDevice', () => {
    it('fail when connect to faulty IP address', async () => {
        //GIVEN
        jest.mocked(execCLI).mockResolvedValue("failed to connect to '1.1.1.1:5555': Operation timed out");
        //WHEN
        const result = await deviceManager.connectToWifiDevice('1.1.1.1');

        //THEN
        expect(execCLI).toHaveBeenCalledTimes(1);
        expect(result).toBeFalsy();
    });
    it('pass when connect to correct IP address', async () => {
        //GIVEN
        jest.mocked(execCLI).mockResolvedValue('connected to 1.1.1.1:5555');
        //WHEN
        const result = await deviceManager.connectToWifiDevice('1.1.1.1');

        //THEN
        expect(execCLI).toHaveBeenCalledTimes(1);
        expect(result).toBeTruthy();
    });
});

describe('askForNewEmulator', () => {
    it('fail when user declines', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';

        jest.mocked(inquirerPrompt).mockResolvedValue({ confirm: 'false' });
        //WHEN
        //THEN
        expect(deviceManager.askForNewEmulator()).rejects.toBe('Action canceled!');
    });
    it('pass', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';

        jest.mocked(inquirerPrompt).mockResolvedValueOnce({ confirm: 'true' });
        jest.mocked(inquirerPrompt).mockResolvedValueOnce({ newEmuName: 'mock_emu' });
        jest.mocked(execCLI).mockResolvedValue('command completed');
        const spy1 = jest.spyOn(deviceManager, 'launchAndroidSimulator').mockResolvedValue(true);

        //WHEN
        const result = deviceManager.askForNewEmulator();
        //THEN
        expect(execCLI).toHaveBeenCalledTimes(2);
        expect(result).rejects.toBe('Action canceled!');
        spy1.mockRestore();
    });
});
