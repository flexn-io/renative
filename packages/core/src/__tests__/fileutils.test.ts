import { sanitizeDynamicProps } from '../system/fs';

jest.mock('../logging/logger.ts');

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
