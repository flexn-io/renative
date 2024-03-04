import { BabelConfig } from '@rnv/core';
import { withRNVWebpack } from '@rnv/sdk-webpack';

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

export { withRNVWebpack, withRNVBabel };
