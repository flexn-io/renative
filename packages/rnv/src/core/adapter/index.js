import fs from 'fs';

export const withRNVBabel = cnf => (api) => {
    if (!fs.existsSync(process.env.RNV_ENGINE_PATH)) {
        throw new Error(`Path to engine cannot be resolved: ${process.env.RNV_ENGINE_PATH}`);
    }
    const engine = require(process.env.RNV_ENGINE_PATH); // eslint-disable-line import/no-dynamic-require, global-require
    const aliases = engine.default.getAliases ? engine.default.getAliases() : {};
    api.cache(true);
    return {
        retainLines: true,
        // presets: ['module:metro-react-native-babel-preset'],
        presets: ['module:babel-preset-expo'],
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: ['..'],
                    alias: { ...aliases }
                },
            ],
        ],
        ...cnf
    };
};


export const withRNVMetro = (cnf) => {
    const engine = require(process.env.RNV_ENGINE_PATH); // eslint-disable-line import/no-dynamic-require, global-require
    if (engine.withRNV) {
        return engine.withRNV(cnf);
    }

    return cnf;
};
