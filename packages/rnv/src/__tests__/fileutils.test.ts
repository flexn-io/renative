import { sanitizeDynamicProps } from '../../src/core/systemManager/fileutils';

jest.mock('../../src/core/systemManager/logger.js', () => {
    const _chalkCols = {
        white: (v) => v,
        green: (v) => v,
        red: (v) => v,
        yellow: (v) => v,
        default: (v) => v,
        gray: (v) => v,
        grey: (v) => v,
        blue: (v) => v,
        cyan: (v) => v,
        magenta: (v) => v,
    };
    _chalkCols.rgb = () => (v) => v;
    _chalkCols.bold = _chalkCols;
    const _chalkMono = {
        ..._chalkCols,
    };
    return {
        logToSummary: jest.fn(),
        logTask: jest.fn(),
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logError: jest.fn(),
        logWarning: jest.fn(),
        logSuccess: jest.fn(),
        chalk: () => _chalkMono,
    };
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
