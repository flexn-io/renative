process.env.NODE_ENV = 'development';
const configFactory = require('react-scripts/config/webpack.config.js');
const { merge } = require('webpack-merge');

export const withRNVWebpack = (cnf: any) => {
    const config = configFactory('development');
    console.log(config, 'CONFIG_DEF');
    return cnf;
};
