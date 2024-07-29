import path from 'path';
import { Configuration } from 'webpack';

import { mergeWithCustomize, unique, merge } from 'webpack-merge';

export const withRNVWebpack = (cnf: Configuration) => {
    //TODO: implement further overrides
    const rnvConfig: Configuration = {};
    const config = merge(rnvConfig, cnf);
    console.log('config:');
    console.log(config);
    console.log('end of config');
    return config;
};

export const getMergedConfig = (rootConfig: Configuration, appPath: string) => {
    // RNV-ADDITION

    const projectConfig = require(path.join(appPath, 'webpack.config'));
    const rootPlugins = rootConfig.plugins?.map((plugin) => plugin?.constructor.name) as string[];

    const mergedConfig: Configuration = mergeWithCustomize({
        customizeArray: unique('plugins', rootPlugins, (plugin) => plugin.constructor && plugin.constructor.name),
    })(rootConfig, projectConfig);

    // Merge => static config, adapter config , project config
    // RNV-ADDITION

    return mergedConfig;
};
