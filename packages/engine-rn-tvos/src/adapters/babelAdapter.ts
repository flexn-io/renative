import { BabelConfig } from '@rnv/core';

export const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: ['module:metro-react-native-babel-preset'],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [process.env.RNV_MONO_ROOT],
                    alias: {
                        'react-native': process.env.RNV_REACT_NATIVE_PATH,
                    },
                },
            ],
            ...plugins,
        ],
    };
};
