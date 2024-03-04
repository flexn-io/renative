import fs from 'fs';
import { BabelApi, BabelConfig, logInfo } from '@rnv/core';

export const withDefaultRNVBabel = (cnf: BabelConfig): BabelConfig => ({
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

export const withRNVBabel =
    (cnf: BabelConfig) =>
    (api: BabelApi): BabelConfig => {
        api.cache(true);
        if (process.env.RNV_ENGINE_PATH && !fs.existsSync(process.env.RNV_ENGINE_PATH)) {
            logInfo(`Path to engine cannot be resolved: ${process.env.RNV_ENGINE_PATH}. Will use default one`);
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

export const withRNVMetro = (cnf: unknown) => {
    if (process.env.RNV_ENGINE_PATH) {
        const engine = require(process.env.RNV_ENGINE_PATH);
        if (engine.withRNVMetro) {
            return engine.withRNVMetro(cnf);
        }
    }

    return cnf;
};

export const withRNVRNConfig = (cnf: unknown) => {
    if (process.env.RNV_ENGINE_PATH) {
        const engine = require(process.env.RNV_ENGINE_PATH);
        if (engine.withRNVRNConfig) {
            return engine.withRNVRNConfig(cnf);
        }
    }

    return cnf;
};
