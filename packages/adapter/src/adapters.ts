import fs from 'fs';
import type { BabelApi, BabelConfig, BabelConfigPlugin } from './types';

const env = process?.env;

export const withBabelPluginModuleResolver = (cnf?: any): BabelConfigPlugin => [
    require.resolve('babel-plugin-module-resolver'),
    {
        root: [env.RNV_MONO_ROOT || '.'],
        ...(cnf || {}),
    },
];

const _withDefaultRNVBabel = (cnf: BabelConfig): BabelConfig => ({
    retainLines: true,
    presets: [['@babel/preset-env', {}]],
    plugins: [withBabelPluginModuleResolver()],
    ...cnf,
});

export const withRNVBabel =
    (cnf: BabelConfig) =>
    (api: BabelApi): BabelConfig => {
        api.cache(true);
        if (env.RNV_ENGINE_PATH && !fs.existsSync(env.RNV_ENGINE_PATH)) {
            console.warn(`Path to engine cannot be resolved: ${env.RNV_ENGINE_PATH}. Will use default one`);
            api.cache(false);
            return _withDefaultRNVBabel(cnf);
        }

        if (env.RNV_ENGINE_PATH) {
            const engine = require(env.RNV_ENGINE_PATH);
            api.cache(true);
            if (engine.withRNVBabel) {
                return engine.withRNVBabel(cnf);
            }
        }

        return cnf;
    };

export const withRNVMetro = (cnf: unknown) => {
    if (env.RNV_ENGINE_PATH) {
        const engine = require(env.RNV_ENGINE_PATH);
        if (engine.withRNVMetro) {
            return engine.withRNVMetro(cnf);
        }
    }

    return cnf;
};

export const withRNVRNConfig = (cnf: unknown) => {
    if (env.RNV_ENGINE_PATH) {
        const engine = require(env.RNV_ENGINE_PATH);
        if (engine.withRNVRNConfig) {
            return engine.withRNVRNConfig(cnf);
        }
    }

    return cnf;
};

export const withRNVNext = (cnf: unknown) => {
    if (env.RNV_ENGINE_PATH) {
        const engine = require(env.RNV_ENGINE_PATH);
        if (engine.withRNVNext) {
            return engine.withRNVNext(cnf);
        }
    }

    return cnf;
};

export const withRNVWebpack = (cnf: unknown) => {
    if (env.RNV_ENGINE_PATH) {
        const engine = require(env.RNV_ENGINE_PATH);
        if (engine.withRNVWebpack) {
            return engine.withRNVWebpack(cnf);
        }
    }

    return cnf;
};
