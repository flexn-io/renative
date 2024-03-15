import { BabelConfig, withBabelPluginModuleResolver } from '@rnv/adapter';

export const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];
    return {
        retainLines: true,
        presets: [['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }]],
        ...cnf,
        plugins: [withBabelPluginModuleResolver(), ...plugins],
    };
};
