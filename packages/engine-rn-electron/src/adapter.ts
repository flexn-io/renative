import { BabelConfig, withBabelPluginModuleResolver } from '@rnv/adapter';
import { withRNVWebpack } from '@rnv/sdk-webpack';

const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];
    return {
        retainLines: true,
        // TODO: determine if this is the best preset for rn-electron as we do not use metro/hermes features in this engine
        // presets: [['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }]],
        presets: [[require.resolve('metro-react-native-babel-preset'), { useTransformReactJSXExperimental: true }]],
        ...cnf,
        plugins: [withBabelPluginModuleResolver(), ...plugins],
    };
};


export { withRNVWebpack, withRNVBabel };