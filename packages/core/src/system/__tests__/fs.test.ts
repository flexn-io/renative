import { sanitizeDynamicProps, getRelativePath } from '../fs';
import { getContext } from '../../context/provider';
import { generateContextDefaults } from '../../context/defaults';

jest.mock('../../logger');
jest.mock('../../context/provider');

beforeAll(() => {
    // Before all placeholder
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('sanitizeDynamicProps', () => {
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
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
        c.buildConfig = {
            common: {
                runtime: '{{files.project.config.common.runtime}}',
            },
        };
        const propConfig = {
            files: {
                project: {
                    config: {
                        common: {
                            runtime: 'bar',
                        },
                    },
                },
            },
            runtimeProps: {},
            props: {},
            configProps: {},
        };
        const result = sanitizeDynamicProps(c.buildConfig, propConfig);
        expect(result.common?.runtime).toEqual('bar');
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
