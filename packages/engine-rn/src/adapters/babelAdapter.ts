import { BabelConfig, withBabelPluginModuleResolver } from '@rnv/adapter';

export const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: ['module:@react-native/babel-preset'],
        ...cnf,
        plugins: [withBabelPluginModuleResolver(), ...plugins],
    };
};
