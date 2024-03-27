import { BabelConfig, withBabelPluginModuleResolver } from '@rnv/adapter';

export const withRNVBabel = (cnf: BabelConfig): BabelConfig => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: [
            [
                'module:babel-preset-expo',
                {
                    // @ts-ignore TODO: this is to supress babel-preset-expo error. this config override does work
                    web: {
                        disableImportExportTransform: false,
                    },
                },
            ],
        ],
        ...cnf,
        plugins: [withBabelPluginModuleResolver(), ...plugins],
    };
};
