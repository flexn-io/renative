import { BabelConfig } from '@rnv/core';
process.env.NODE_ENV = 'development';
// const configFactory = require('react-scripts/config/webpack.config.js');
// const { merge } = require('webpack-merge');

const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: [['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }]],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [process.env.RNV_MONO_ROOT || '.'],
                },
            ],
            ...plugins,
        ],
    };
};

const withRNVWebpack = (cnf: any) => {
    // const config = configFactory('development');
    // console.log(config, 'CONFIG_DEF');
    return cnf;
};

const withRNV = withRNVWebpack;

export { withRNV, withRNVBabel };
