import { getValidLocalhost, getDevServerHost, getAppVersionCode } from '../';
import {
    DEFAULTS,
    createRnvApi,
    createRnvContext,
    getContext,
    generateContextDefaults,
    getConfigProp,
} from '@rnv/core';

jest.mock('@rnv/core');
jest.mock('path');

const BUILD_CONF = generateContextDefaults();

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

describe('Test getValidLocalhost', () => {
    it('should return passed localhost when value is falsy', () => {
        const result = getValidLocalhost('', 'localhost');
        expect(result).toBe('localhost');
    });

    it('should return localhost for known values', () => {
        const values = ['localhost', '0.0.0.0', '127.0.0.1'];
        const localhost = 'localhost';
        values.forEach((value) => {
            const result = getValidLocalhost(value, localhost);
            expect(result).toBe(localhost);
        });
    });

    it('should return passed value for the rest cases', () => {
        const result = getValidLocalhost('unknownValue', 'localhost');
        expect(result).toBe('unknownValue');
    });
});

describe('Test getDevServerHost', () => {
    it('should return DEFAULTS.devServerHost when devServerHost is not defined', () => {
        const c = getContext();
        c.runtime.localhost = '0.0.0.0 ';

        jest.spyOn(require('@rnv/core'), 'getConfigProp').mockReturnValue(undefined);

        const result = getDevServerHost(c);

        expect(result).toBe(DEFAULTS.devServerHost);
    });
    it('should return a fixed devServerHost when defined and equal to one of the known values', () => {
        const c = getContext();
        c.runtime.localhost = '0.0.0.0';

        jest.spyOn(require('@rnv/core'), 'getConfigProp').mockReturnValue('localhost');
        jest.spyOn(require('../'), 'getValidLocalhost').mockReturnValue('0.0.0.0');

        const result = getDevServerHost(c);

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
        jest.mocked(getConfigProp).mockReturnValueOnce('1'); //version
        expect.assertions(1);
        try {
            // WHEN
            getAppVersionCode(getContext(), 'android');
        } catch (e) {
            // THEWN
            expect(e).toEqual(Error(`'versionCode' should be a positive integer. Check your config`));
        }
    });

    it('should throw on given versionCode negative on android', async () => {
        expect.assertions(1);
        try {
            getAppVersionCode(
                {
                    ...BUILD_CONF,
                    files: {
                        ...BUILD_CONF.files,
                        project: {
                            ...BUILD_CONF.files.project,
                            package: { version: '1' },
                        },
                    },
                    buildConfig: {
                        common: {
                            versionCode: '-1',
                        },
                    },
                },
                'android'
            );
        } catch (e) {
            expect(e).toEqual(Error(`'versionCode' should be a positive integer. Check your config`));
        }
    });

    it('should evaluate given versionCode 4.4.4 with 4.4.4 on ios', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '1' },
                    },
                },
                buildConfig: {
                    common: {
                        versionCode: '4.4.4',
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('4.4.4');
    });
});

// TO TEST:
// 0.0.4
// 1.2.3
// 10.20.30
// 1.1.2-prerelease+meta
// 1.1.2+meta
// 1.1.2+meta-valid
// 1.0.0-alpha
// 1.0.0-beta
// 1.0.0-alpha.beta
// 1.0.0-alpha.beta.1
// 1.0.0-alpha.1
// 1.0.0-alpha0.valid
// 1.0.0-alpha.0valid
// 1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay
// 1.0.0-rc.1+build.1
// 2.0.0-rc.1+build.123
// 1.2.3-beta
// 10.2.3-DEV-SNAPSHOT
// 1.2.3-SNAPSHOT-123
// 1.0.0
// 2.0.0
// 1.1.7
// 2.0.0+build.1848
// 2.0.1-alpha.1227
// 1.0.0-alpha+beta
// 1.2.3----RC-SNAPSHOT.12.9.1--.12+788
// 1.2.3----R-S.12.9.1--.12+meta
// 1.2.3----RC-SNAPSHOT.12.9.1--.12
// 1.0.0+0.build.1-rc.10000aaa-kk-0.1
// 99999999999999999999999.999999999999999999.99999999999999999
// 1.0.0-0A.is.legal
