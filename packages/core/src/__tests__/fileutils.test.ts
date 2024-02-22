import { createPlatformBuild } from '../platforms';
import { createRnvApi } from '../api';
import { createRnvContext } from '../context';
import { sanitizeDynamicProps, getRelativePath } from '../system/fs';
import { RnvPlatform } from '../types';
import { getContext } from '../context/provider';
import { doResolve } from '../system/resolve';

jest.mock('../logger');
jest.mock('../system/fs', () => {
    const original = jest.requireActual('../system/fs');

    return {
        ...original,
        copyFolderContentsRecursiveSync: jest.fn(),
    };
});

describe('sanitizeDynamicProps', () => {
    beforeAll(() => {
        createRnvContext();
        createRnvApi();
    });

    it('sanitize {{props.XXX}}', async () => {
        const buildConfig = {
            common: {
                foo: '{{props.FOO}}',
            },
        };
        const propConfig = {
            files: {},
            runtimeProps: {},
            props: {
                FOO: 'bar',
            },
            configProps: {},
        };
        const result = sanitizeDynamicProps(buildConfig, propConfig);
        expect(result.common.foo).toEqual('bar');
    });

    it('sanitize {{configProps.XXX}}', async () => {
        const buildConfig = {
            common: {
                foo: '{{configProps.FOO}}',
            },
        };
        const propConfig = {
            files: {},
            runtimeProps: {},
            props: {},
            configProps: {
                FOO: 'bar',
            },
        };
        const result = sanitizeDynamicProps(buildConfig, propConfig);
        expect(result.common.foo).toEqual('bar');
    });

    it('sanitize {{files.XXX}}', async () => {
        const buildConfig = {
            common: {
                foo: '{{files.project.config.common.foo}}',
            },
        };
        const propConfig = {
            files: {
                project: {
                    config: {
                        common: {
                            foo: 'bar',
                        },
                    },
                },
            },
            runtimeProps: {},
            props: {},
            configProps: {},
        };
        const result = sanitizeDynamicProps(buildConfig, propConfig);
        expect(result.common.foo).toEqual('bar');
    });

    it('sanitize {{runtimeProps.XXX}}', async () => {
        const buildConfig = {
            common: {
                foo: '{{runtimeProps.foo}}',
            },
        };
        const propConfig = {
            files: {},
            runtimeProps: {
                foo: 'bar',
            },
            props: {},
            configProps: {},
        };
        const result = sanitizeDynamicProps(buildConfig, propConfig);
        expect(result.common.foo).toEqual('bar');
    });

    it('sanitize {{env.XXX}}', async () => {
        const buildConfig = {
            common: {
                foo: '{{env.foo}}',
            },
        };
        process.env.foo = 'bar';
        const propConfig = {
            files: {},
            runtimeProps: {},
            props: {},
            configProps: {},
        };
        const result = sanitizeDynamicProps(buildConfig, propConfig);
        expect(result.common.foo).toEqual('bar');
    });
});

describe('getRelativePath', () => {
    it('returns the correct relative path when path is a subdirectory', () => {
        const from = '/Users/user/some/path/packages/core/src';
        const to = '/Users/user/some/path/packages/core/src/system/fs.ts';
        const expected = './system/fs.ts';
        const result = getRelativePath(from, to);
        expect(result).toEqual(expected);
    });

    it('returns the correct relative path when path is a parent directory', () => {
        const from = '/Users/user/some/path/packages/core/src/system/fs.ts';
        const to = '/Users/user/some/path/packages/core/src';
        const expected = '../..';
        const result = getRelativePath(from, to);
        expect(result).toEqual(expected);
    });
});

describe('createPlatformBuild', () => {
    // GIVEN
    const platform: RnvPlatform = 'ios';
    const c = getContext();
    c.runtime.availablePlatforms = ['ios', 'android'];
    c.paths.project.platformTemplatesDirs[platform] = '/path/to/pt';
    const { copyFolderContentsRecursiveSync } = require('../system/fs');

    it('should copy platform template files to app folder', async () => {
        // WHEN
        await createPlatformBuild(c, platform);

        // THEN
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledWith(
            '/path/to/pt/ios',
            'undefined_null', // TODO: fix this
            false,
            ['/path/to/pt/ios/_privateConfig'],
            false,
            [
                {
                    pattern: '{{PATH_REACT_NATIVE}}',
                    override:
                        doResolve(c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native', true, {
                            forceForwardPaths: true,
                        }) || '',
                },
            ],
            undefined,
            c
        );
    });
});
