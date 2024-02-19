import path from 'path';

process.env.NODE_ENV = 'development';
// const configFactory = require('react-scripts/config/webpack.config.js');
// const { merge } = require('webpack-merge');
import { merge } from 'webpack-merge';

export const withRNVWebpack = (cnf: WebpackConfig) => {
    // const config = configFactory('development');
    console.log(cnf, 'CONFIG_DEF');
    //TODO: implement further overrides
    const rnvConfig: WebpackConfig = {};
    merge<WebpackConfig>(rnvConfig, cnf);
    return cnf;
};

type WebpackConfig = any;

export const getMergedConfig = (rootConfig: WebpackConfig, appPath: string) => {
    // RNV-ADDITION
    const projectConfig = require(path.join(appPath, 'webpack.config'));

    const mergedConfig = merge<WebpackConfig>(rootConfig, projectConfig);
    // Merge => static config, adapter config , project config
    // RNV-ADDITION
    return mergedConfig;
};
