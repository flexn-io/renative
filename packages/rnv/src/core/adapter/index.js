import fs from 'fs';
import { logInfo } from '../systemManager/logger';

export const withDefaultRNVBabel = (cnf) => ({
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

export const withRNVBabel = (cnf) => (api) => {
    if (!fs.existsSync(process.env.RNV_ENGINE_PATH)) {
        logInfo(`Path to engine cannot be resolved: ${process.env.RNV_ENGINE_PATH}. Will use default one`);
        api.cache(false);
        return withDefaultRNVBabel(cnf);
    }
    const engine = require(process.env.RNV_ENGINE_PATH);
    api.cache(true);
    if (engine.withRNVBabel) {
        return engine.withRNVBabel(cnf);
    }

    return cnf;
};

export const withRNVMetro = (cnf) => {
    const engine = require(process.env.RNV_ENGINE_PATH);
    if (engine.withRNV) {
        return engine.withRNV(cnf);
    }

    return cnf;
};
