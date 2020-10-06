import { getAppVersionCode } from '../../src/core/common';

jest.mock('../../src/core/systemManager/logger.js', () => {
    const _chalkCols = {
        white: v => v,
        green: v => v,
        red: v => v,
        yellow: v => v,
        default: v => v,
        gray: v => v,
        grey: v => v,
        blue: v => v,
        cyan: v => v,
        magenta: v => v
    };
    _chalkCols.rgb = () => v => v;
    _chalkCols.bold = _chalkCols;
    const _chalkMono = {
        ..._chalkCols
    };
    return {
        logToSummary: jest.fn(),
        logTask: jest.fn(),
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logError: jest.fn(),
        logWarning: jest.fn(),
        logSuccess: jest.fn(),
        chalk: () => _chalkMono
    };
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

const BUILD_CONF = {
  runtime: {
    scheme: 'debug'
  },
  buildConfig: {
    common: {

    }
  }
}

describe('Testing getAppVersionCode functions', () => {
    it('should evaluate 1.2.3', async () => {
        const result = getAppVersionCode({ ...BUILD_CONF, files: { project: { package: { version: '1.2.3' }}}});
        expect(result).toEqual('10203');
    });

    it('should evaluate 1.2.3 with 00.00.00.00.00', async () => {
        const result = getAppVersionCode({
          ...BUILD_CONF,
          buildConfig: { common: { versionCodeFormat: '00.00.00.00.00' }},
          files: { project: { package: { version: '1.2.3' }}}});
        expect(result).toEqual('102030000');
    });

    it('should evaluate 2.0.0+build.1848', async () => {
        const result = getAppVersionCode({ ...BUILD_CONF, files: { project: { package: { version: '2.0.0+build.1848' }}}});
        expect(result).toEqual('2000018');
    });

    it('should evaluate 2.0.0+build.1848 with 00.00.0000', async () => {
        const result = getAppVersionCode({
          ...BUILD_CONF,
          buildConfig: { common: { versionCodeFormat: '00.00.0000' }},
          files: { project: { package: { version: '2.0.0+build.1848' }}}});
        expect(result).toEqual('200001848');
    });

    it('should evaluate 1.0.0-alpha+beta', async () => {
        const result = getAppVersionCode({ ...BUILD_CONF, files: { project: { package: { version: '1.0.0-alpha+beta' }}}});
        expect(result).toEqual('10000');
    });

    it('should evaluate 999999999999.99999999999.9999999', async () => {
        const result = getAppVersionCode({ ...BUILD_CONF, files: { project: { package: { version: '999999999999.99999999999.9999999' }}}});
        expect(result).toEqual('999999');
    });

    it('should evaluate 2.0.1-alpha.1227', async () => {
        const result = getAppVersionCode({ ...BUILD_CONF, files: { project: { package: { version: '2.0.1-alpha.1227' }}}});
        expect(result).toEqual('2000112');
    });

    it('should evaluate 2.0.1-alpha.1227', async () => {
        const result = getAppVersionCode({
          ...BUILD_CONF,
          buildConfig: { common: { versionCodeFormat: '00.00.0000' }},
          files: { project: { package: { version: '2.0.1-alpha.1227' }}}});
        expect(result).toEqual('200011227');
    });

    it('should evaluate 1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay', async () => {
        const result = getAppVersionCode({ ...BUILD_CONF, files: { project: { package: { version: '1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay' }}}});
        expect(result).toEqual('100000101');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85', async () => {
        const result = getAppVersionCode({ ...BUILD_CONF, files: { project: { package: { version: '1.0.1-beta+exp.sha.5114f85' }}}});
        expect(result).toEqual('10001');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85 with 00.00.00.00.00.00', async () => {
        const result = getAppVersionCode({
          ...BUILD_CONF,
          buildConfig: { common: { versionCodeFormat: '00.00.00.00.00.00' }},
          files: { project: { package: { version: '1.0.1-beta+exp.sha.5114f85' }}}});
        expect(result).toEqual('10001000000');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85 with 00.00.00.000000', async () => {
        const result = getAppVersionCode({
          ...BUILD_CONF,
          buildConfig: { common: { versionCodeFormat: '00.00.00.000000' }},
          files: { project: { package: { version: '1.0.1-beta+exp.sha.5114f85' }}}});
        expect(result).toEqual('10001000000');
    });

    it('should evaluate 1', async () => {
        const result = getAppVersionCode({
          ...BUILD_CONF,
          files: { project: { package: { version: '1' }}}});
        expect(result).toEqual('10000');
    });


});
