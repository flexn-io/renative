import { getValidLocalhost, getDevServerHost, getAppVersionCode } from '../';
import { DEFAULTS, createRnvContext, getContext, getConfigProp } from '@rnv/core';

jest.mock('@rnv/core');
jest.mock('axios');
jest.mock('better-opn');
jest.mock('detect-port');
jest.mock('kill-port');
jest.mock('path');
jest.mock('ip');
jest.mock('color-string');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('Test getValidLocalhost', () => {
    it('should return passed localhost when value is falsy', () => {
        // WHEN
        const result = getValidLocalhost('', 'localhost');
        // THEN
        expect(result).toBe('localhost');
    });

    it('should return localhost for known values', () => {
        // GIVEN
        const values = ['localhost', '0.0.0.0', '127.0.0.1'];
        const localhost = 'localhost';
        // WHEN
        values.forEach((value) => {
            const result = getValidLocalhost(value, localhost);
            // THEN
            expect(result).toBe(localhost);
        });
    });

    it('should return passed value for the rest cases', () => {
        // WHEN
        const result = getValidLocalhost('unknownValue', 'localhost');
        // THEN
        expect(result).toBe('unknownValue');
    });
});

describe('Test getDevServerHost', () => {
    it('should return DEFAULTS.devServerHost when devServerHost is not defined', () => {
        // GIVEN
        const c = getContext();
        c.runtime.localhost = '0.0.0.0 ';
        jest.mocked(getConfigProp).mockReturnValue(undefined);
        // WHEN
        const result = getDevServerHost();
        // THEN
        expect(result).toBe(DEFAULTS.devServerHost);
    });
    it('should return a fixed devServerHost when defined and equal to one of the known values', () => {
        // GIVEN
        const c = getContext();
        c.runtime.localhost = '0.0.0.0';
        jest.mocked(getConfigProp).mockReturnValue('localhost');
        // WHEN
        const result = getDevServerHost();
        // THEN
        expect(result).toBe('0.0.0.0');
    });
});

describe('Test getAppVersionCode', () => {
    it('should evaluate 1.2.3', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1.2.3'); //version
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('10203');
    });

    it('should evaluate 1.2.3 with 00.00.00.00.00', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1.2.3'); //version
        jest.mocked(getConfigProp).mockReturnValueOnce('00.00.00.00.00'); //versionCodeFormat
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('102030000');
    });

    it('should evaluate 2.0.0+build.1848', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('2.0.0+build.1848'); //version
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('2000018');
    });

    it('should evaluate 2.0.0+build.1848 with 00.00.0000', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('2.0.0+build.1848'); //version
        jest.mocked(getConfigProp).mockReturnValueOnce('00.00.00.0000'); //versionCodeFormat
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('200001848');
    });

    it('should evaluate 1.0.0-alpha+beta', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1.0.0-alpha+beta'); //version
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('10000');
    });

    it('should evaluate 999999999999.99999999999.9999999', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('999999999999.99999999999.9999999'); //version
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCodeFormat
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('999999');
    });

    it('should evaluate 2.0.1-alpha.1227', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('2.0.1-alpha.1227'); //version
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('2000112');
    });

    it('should evaluate 2.0.1-alpha.1227', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('2.0.1-alpha.1227'); //version
        jest.mocked(getConfigProp).mockReturnValueOnce('00.00.00.0000'); //versionCodeFormat
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('200011227');
    });

    it('should evaluate 1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay'); //version
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('100000101');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1.0.1-beta+exp.sha.5114f85'); //version
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('10001');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85 with 00.00.00.00.00.00', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1.0.1-beta+exp.sha.5114f85'); //version
        jest.mocked(getConfigProp).mockReturnValueOnce('00.00.00.00.00.00'); //versionCodeFormat
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('10001000000');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85 with 00.00.00.000000', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1.0.1-beta+exp.sha.5114f85'); //version
        jest.mocked(getConfigProp).mockReturnValueOnce('00.00.00.000000'); //versionCodeFormat
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('10001000000');
    });

    it('should evaluate 1', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1'); //version
        jest.mocked(getConfigProp).mockReturnValueOnce(undefined); //versionCodeFormat
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('10000');
    });

    it('should evaluate given versionCode 1 with 1 on android', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce('1'); //versionCode
        jest.mocked(getConfigProp).mockReturnValueOnce('1'); //version
        // WHEN
        const result = getAppVersionCode(getContext(), 'android');
        // THEN
        expect(result).toEqual('1');
    });

    it('should throw on given versionCode `string` on android', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce('something as a string'); //versionCode
        expect.assertions(1);
        try {
            // WHEN
            getAppVersionCode(getContext(), 'android');
        } catch (e) {
            // THEN
            expect(e).toEqual(Error(`'versionCode' should be a positive integer. Check your config`));
        }
    });

    it('should throw on given versionCode negative on android', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce('-1'); //versionCode
        expect.assertions(1);
        try {
            // WHEN
            getAppVersionCode(getContext(), 'android');
        } catch (e) {
            // THEN
            expect(e).toEqual(Error(`'versionCode' should be a positive integer. Check your config`));
        }
    });

    it('should evaluate given versionCode 4.4.4 with 4.4.4 on ios', async () => {
        // GIVEN
        jest.mocked(getConfigProp).mockReturnValueOnce('4.4.4'); //versionCode
        // WHEN
        const result = getAppVersionCode(getContext(), 'ios');
        // THEN
        expect(result).toEqual('4.4.4');
    });
});
