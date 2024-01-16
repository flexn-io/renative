import { createRnvApi } from '../api';
import { getAppVersionCode } from '../common';
import { createRnvContext } from '../context';
import { generateContextDefaults } from '../context/defaults';
import { getContext } from '../context/provider';

jest.mock('../logger/index.ts');

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

const BUILD_CONF = generateContextDefaults();
BUILD_CONF.runtime.scheme = 'debug';

describe('Testing getAppVersionCode functions', () => {
    beforeAll(() => {
        createRnvContext();
        createRnvApi();
    });

    it('should evaluate 1.2.3', async () => {
        const c = getContext();
        c.files.project.package.version = '1.2.3';
        const result = getAppVersionCode(c, 'ios');
        expect(result).toEqual('10203');
    });

    it('should evaluate 1.2.3 with 00.00.00.00.00', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                buildConfig: { common: { versionCodeFormat: '00.00.00.00.00' } },
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '1.2.3' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('102030000');
    });

    it('should evaluate 2.0.0+build.1848', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '2.0.0+build.1848' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('2000018');
    });

    it('should evaluate 2.0.0+build.1848 with 00.00.0000', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                buildConfig: { common: { versionCodeFormat: '00.00.00.0000' } },
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '2.0.0+build.1848' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('200001848');
    });

    it('should evaluate 1.0.0-alpha+beta', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '1.0.0-alpha+beta' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('10000');
    });

    it('should evaluate 999999999999.99999999999.9999999', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '999999999999.99999999999.9999999' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('999999');
    });

    it('should evaluate 2.0.1-alpha.1227', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '2.0.1-alpha.1227' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('2000112');
    });

    it('should evaluate 2.0.1-alpha.1227', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                buildConfig: { common: { versionCodeFormat: '00.00.00.0000' } },
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '2.0.1-alpha.1227' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('200011227');
    });

    it('should evaluate 1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('100000101');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '1.0.1-beta+exp.sha.5114f85' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('10001');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85 with 00.00.00.00.00.00', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                buildConfig: { common: { versionCodeFormat: '00.00.00.00.00.00' } },
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '1.0.1-beta+exp.sha.5114f85' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('10001000000');
    });

    it('should evaluate 1.0.1-beta+exp.sha.5114f85 with 00.00.00.000000', async () => {
        const result = getAppVersionCode(
            {
                ...BUILD_CONF,
                buildConfig: { common: { versionCodeFormat: '00.00.00.000000' } },
                files: {
                    ...BUILD_CONF.files,
                    project: {
                        ...BUILD_CONF.files.project,
                        package: { version: '1.0.1-beta+exp.sha.5114f85' },
                    },
                },
            },
            'ios'
        );
        expect(result).toEqual('10001000000');
    });

    it('should evaluate 1', async () => {
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
            },
            'ios'
        );
        expect(result).toEqual('10000');
    });

    it('should evaluate given versionCode 1 with 1 on android', async () => {
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
                        versionCode: '1',
                    },
                },
            },
            'android'
        );
        expect(result).toEqual('1');
    });

    it('should throw on given versionCode `string` on android', async () => {
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
                            versionCode: 'something as a string',
                        },
                    },
                },
                'android'
            );
        } catch (e) {
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
                            versionCode: -1,
                        },
                    },
                },
                'android'
            );
        } catch (e) {
            expect(e).toEqual(Error(`'versionCode' should be a positive integer. Check your config`));
        }
    });
});
