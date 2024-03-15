import { BabelConfig } from '@rnv/core';

export const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: ['module:@react-native/babel-preset'],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [process.env.RNV_MONO_ROOT],
                    alias: {
                        'react-native': 'react-native-tvos',
                        // '^react-native/(.+)': 'react-native-tvos/\\1',
                        'react-native/Libraries/Utilities/codegenNativeComponent':
                            'react-native-tvos/Libraries/Utilities/codegenNativeComponent',
                        'react-native/Libraries/Types/CodegenTypes': 'react-native-tvos/Libraries/Types/CodegenTypes',
                        'react-native/Libraries/Components/ScrollView/ScrollView':
                            'react-native-tvos/Libraries/Components/ScrollView/ScrollView',
                        'react-native/Libraries/StyleSheet/flattenStyle':
                            'react-native-tvos/Libraries/StyleSheet/flattenStyle',
                        'react-native/Libraries/Pressability/PressabilityDebug':
                            'react-native-tvos/Libraries/StyleSheet/flattenStyle',
                        'react-native/Libraries/Pressability/Pressability':
                            'react-native-tvos/Libraries/StyleSheet/flattenStyle',
                    },
                },
            ],
            ...plugins,
        ],
    };
};
