import { getAndroidTargets, composeDevicesArray, connectToWifiDevice, checkForActiveEmulator } from '../deviceManager';
import { getAndroidDeviceToRunOn } from '../runner';
import { createRnvContext, getContext, inquirerPrompt } from '@rnv/core';
import net from 'net';

jest.mock('../deviceManager');
jest.mock('@rnv/core');
jest.mock('net');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('getAndroidDeviceToRunOn', () => {
    it('should fail if a device is provided but no active device exists', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.target = true;
        ctx.program.device = 'device1';
        ctx.runtime.target = 'defaultTarget';
        const mockFoundDevice = { name: 'simulator1', isActive: false, udid: '', isDevice: false };

        jest.mocked(getAndroidTargets).mockResolvedValue([mockFoundDevice]);

        //WHEN
        await expect(getAndroidDeviceToRunOn(ctx)).resolves.toBe(undefined);

        //THEN
    });
    it('should fail if targetToConnectWiFi is not a valid IP address - npx rnv -p android -t -d <invalidIPAdress>', async () => {
        //GIVEN
        const targetToConnectWiFi = 'invalidIPAdress';
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.target = true;
        ctx.runtime.target = 'defaultTarget';
        ctx.program.device = targetToConnectWiFi;
        const mockFoundDevice = { name: 'simulator1', isActive: false, udid: '', isDevice: false };

        net.isIP = jest.fn().mockReturnValue(false);

        jest.mocked(getAndroidTargets).mockResolvedValue([mockFoundDevice]);

        //WHEN
        await expect(getAndroidDeviceToRunOn(ctx)).resolves.toBe(undefined);

        //THEN
        expect(connectToWifiDevice).not.toHaveBeenCalled();
    });
    it('should connect to WiFi device if targetToConnectWiFi is a string and a valid IP address', async () => {
        //GIVEN
        const targetToConnectWiFi = '192.168.0.1';
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.target = true;
        ctx.runtime.target = 'defaultTarget';
        ctx.program.device = targetToConnectWiFi;
        net.isIP = jest.fn().mockReturnValue(true);

        jest.mocked(connectToWifiDevice).mockResolvedValue(true);
        const mockFoundDevice = { name: '192.168.0.1', isActive: true, udid: '', isDevice: true };
        jest.mocked(getAndroidTargets).mockResolvedValue([mockFoundDevice]);
        jest.mocked(checkForActiveEmulator).mockResolvedValue(mockFoundDevice);

        //WHEN
        const result = await getAndroidDeviceToRunOn(ctx);

        //THEN
        expect(connectToWifiDevice).toHaveBeenCalledWith(ctx, targetToConnectWiFi);
        expect(result).toEqual(mockFoundDevice);
    });
    it('should return defaultTarget if it exists and -t is not specified', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.target = undefined;
        ctx.runtime.target = 'defaultTarget';
        const mockFoundDevice = { name: 'defaultTarget', isActive: true, udid: '', isDevice: false };

        jest.mocked(getAndroidTargets).mockResolvedValue([mockFoundDevice]);

        const result = await getAndroidDeviceToRunOn(ctx);
        //THEN
        expect(result).toEqual(mockFoundDevice);
    });
    it('should return found sim if target is provided and found - npx rnv -p android -t <target>', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.target = 'existingTarget';
        ctx.runtime.target = 'defaultTarget';
        const mockFoundDevice = { name: 'existingTarget', isActive: true, udid: '' };
        jest.mocked(getAndroidTargets).mockResolvedValueOnce([mockFoundDevice]);
        //WHEN
        const result = await getAndroidDeviceToRunOn(ctx);
        //THEN
        expect(result).toEqual(mockFoundDevice);
    });
    it('should ask devices and sims if no target is specified and the available target list does not include defaultTarget - npx rnv -p android - npx rnv -p android', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.program.target = false;
        ctx.runtime.target = 'defaultTarget';

        const mockDevicesAndEmulators = [
            { name: 'simulator1', udid: 'udid1', isActive: true },
            { name: 'simulator2', udid: 'udid2', isActive: false },
        ];

        jest.mocked(getAndroidTargets).mockResolvedValue(mockDevicesAndEmulators);
        jest.mocked(composeDevicesArray)
            .mockReturnValueOnce([
                {
                    key: 'simulator1',
                    name: 'simulator1',
                    value: 'simulator1',
                    icon: 'Phone 📱',
                },
            ])
            .mockReturnValueOnce([
                {
                    key: 'simulator2',
                    name: 'simulator2',
                    value: 'simulator2',
                    icon: 'Phone 📱',
                },
            ]);
        jest.mocked(inquirerPrompt).mockResolvedValue({ chosenTarget: 'simulator1' });
        //WHEN
        const result = await getAndroidDeviceToRunOn(ctx);
        //THEN
        expect(result).toEqual(mockDevicesAndEmulators[0]);
    });
});
