import fs from 'fs';

export const withRNVBabel = cnf => (api) => {
    if (!fs.existsSync(process.env.RNV_ENGINE_PATH)) {
        throw new Error(`Path to engine cannot be resolved: ${process.env.RNV_ENGINE_PATH}`);
    }
    const engine = require(process.env.RNV_ENGINE_PATH); // eslint-disable-line import/no-dynamic-require, global-require
    api.cache(true);
    if (engine.withRNVBabel) {
        return engine.withRNVBabel(cnf);
    }

    return cnf;
};

export const withRNVMetro = (cnf) => {
    const engine = require(process.env.RNV_ENGINE_PATH); // eslint-disable-line import/no-dynamic-require, global-require
    if (engine.withRNV) {
        return engine.withRNV(cnf);
    }

    return cnf;
};
