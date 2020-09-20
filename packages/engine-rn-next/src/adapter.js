const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withCSS = require('@zeit/next-css');
const path = require('path');
const nextTranspile = require('next-transpile-modules');


export const withRNV = (config) => {
    const cnf = {
        ...config,
        distDir: process.env.NEXT_DIST_DIR,
        webpack: (cfg, props) => {
            const { isServer } = props;
            const rootPath = process.env.RNV_PROJECT_ROOT || process.cwd();
            cfg.resolve.extensions = process.env.RNV_EXTENSIONS.split(',').map(e => `.${e}`).filter(ext => isServer || !ext.includes('server.'));
            cfg.resolve.modules.unshift(path.resolve(rootPath));
            if (process.env.RNV_MODULE_ALIASES) {
                const mAliases = process.env.RNV_MODULE_ALIASES.split(',');
                mAliases.forEach((mAlias) => {
                    const aliasArr = mAlias.split(':');
                    cfg.resolve.alias[aliasArr[0]] = aliasArr[1];
                });
            }
            cfg.module.rules[0].test = /\.(tsx|ts|js|mjs|jsx)$/;
            // cfg.module.rules.push({
            //     test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            //     use: {
            //         loader: 'url-loader',
            //         options: {
            //             limit: 100000,
            //             name: '[name].[ext]',
            //         },
            //     },
            // });
            if (typeof config.webpack === 'function') {
                return config.webpack(cfg, props);
            }
            return cfg;
        },
    };
    let transModules = [];
    // console.log('Transpiled Modules:', process.env.RNV_NEXT_TRANSPILE_MODULES.split(','));
    if (process.env.RNV_NEXT_TRANSPILE_MODULES) {
        transModules = process.env.RNV_NEXT_TRANSPILE_MODULES.split(',');
    }

    const withTM = nextTranspile(transModules);
    const cnf1 = withExpo(withCSS(withFonts(withImages(withTM(cnf)))));
    cnf1.pageExtensions = process.env.RNV_EXTENSIONS.split(',');
    return cnf1;
};
