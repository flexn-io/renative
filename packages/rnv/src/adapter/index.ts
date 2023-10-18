import fs from 'fs';

export const withDefaultRNVBabel = (cnf: any) => ({
    retainLines: true,
    presets: [['@babel/preset-env', {}]],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: [process.env.RNV_MONO_ROOT || '.'],
            },
        ],
    ],
    ...cnf,
});

export const withRNVBabel = (cnf: any) => (api: any) => {
    if (process.env.RNV_ENGINE_PATH && !fs.existsSync(process.env.RNV_ENGINE_PATH)) {
        api.cache(false);
        return withDefaultRNVBabel(cnf);
    }

    if (process.env.RNV_ENGINE_PATH) {
        const engine = require(process.env.RNV_ENGINE_PATH);
        api.cache(true);
        if (engine.withRNVBabel) {
            return engine.withRNVBabel(cnf);
        }
    }

    return cnf;
};

export const withRNVMetro = (cnf: any) => {
    if (process.env.RNV_ENGINE_PATH) {
        const engine = require(process.env.RNV_ENGINE_PATH);
        if (engine.withRNV) {
            return engine.withRNV(cnf);
        }
    }

    return cnf;
};

export const withRNVRNConfig = (cnf: any) => {
    if (process.env.RNV_ENGINE_PATH) {
        const engine = require(process.env.RNV_ENGINE_PATH);
        if (engine.withRNVRNConfig) {
            return engine.withRNVRNConfig(cnf);
        }
    }

    return cnf;
};