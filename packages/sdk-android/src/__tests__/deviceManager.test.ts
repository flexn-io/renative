import { getContext } from '@rnv/core';
import { composeDevicesArray, composeDevicesString, launchAndroidSimulator } from '../deviceManager';
import { AndroidDevice } from '../types';

jest.mock('@rnv/core');

describe('composeDevicesString', () => {
    it('returns empty string if there is no devices', async () => {
        //GIVEN
        const devicesArray: Array<AndroidDevice> = [];
        //WHEN
        const result = composeDevicesString(devicesArray);

        //THEN
        expect(result).toEqual('\n');
    });
    it('returns devices string if there are devices', async () => {
        //GIVEN
        const devicesArray: Array<AndroidDevice> = [];
        const device1: AndroidDevice = {
            udid: 'unknown',
            isActive: false,
            name: 'MockDevice1',
        };
        devicesArray.push(device1);
        //WHEN
        const result = composeDevicesString(devicesArray);

        //THEN
        expect(result).toEqual('\n [1]> MockDevice1 |  | arch: undefined | udid: unknown \n');
    });
});

describe('composeDevicesArray', () => {
    it('returns empty array if there is no devices', async () => {
        //GIVEN
        const devicesArray: Array<AndroidDevice> = [];
        //WHEN
        const result = composeDevicesArray(devicesArray);

        //THEN
        expect(result).toEqual([]);
    });
    it('returns devices aray if there are devices', async () => {
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
        const result = composeDevicesArray(devicesArray);

        //THEN
        expect(result).toEqual(expectedResult);
    });
});

describe('launchAndroidSimulator', () => {
    it('launch sim with empty target name', async () => {
        //GIVEN
        const errorMessage = 'No simulator -t target name specified!';
        //WHEN
        //THEN
        expect(launchAndroidSimulator('')).rejects.toBe(errorMessage);
    });
});
