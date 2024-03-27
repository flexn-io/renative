import { BabelConfig, withBabelPluginModuleResolver } from '@rnv/adapter';
import { withRNVWebpack } from '@rnv/sdk-webpack';

const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: [[require.resolve('metro-react-native-babel-preset'), { useTransformReactJSXExperimental: true }]],
        ...cnf,
        plugins: [withBabelPluginModuleResolver(), ...plugins],
    };
};

export { withRNVWebpack, withRNVBabel };
