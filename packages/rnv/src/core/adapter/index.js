export const withRNVBabel = cnf => (api) => {
    const engine = require(process.env.RNV_ENGINE_PATH); // eslint-disable-line import/no-dynamic-require, global-require
    const aliases = engine.default.getAliases ? engine.default.getAliases() : {};
    api.cache(true);
    const plugins = cnf?.plugins || [];
    return {
        retainLines: true,
        // presets: ['module:metro-react-native-babel-preset'],
        presets: ['module:babel-preset-expo'],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: ['..'],
                    alias: { ...aliases }
                },
            ],
            ...plugins
        ],

    };
};


export const withRNVMetro = (cnf) => {
    const engine = require(process.env.RNV_ENGINE_PATH); // eslint-disable-line import/no-dynamic-require, global-require
    if (engine.withRNV) {
        return engine.withRNV(cnf);
    }

    return cnf;
};
