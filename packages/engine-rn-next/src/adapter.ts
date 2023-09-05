const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
// DEPRECATED
// const withOptimizedImages = require('next-optimized-images');
const withFonts = require('next-fonts');
const path = require('path');
const nextTranspile = require('next-transpile-modules');
// DEPRECATED
// const withCSS = require('@zeit/next-css');

export const withRNVNext = (config: any, opts: any) => {
    const cnf = {
        ...config,
        images: {
            disableStaticImages: true,
            ...(config?.images || {}),
        },
        // webpack5: false,
        distDir: process.env.NEXT_DIST_DIR,
        webpack: (cfg: any, props: any) => {
            const { isServer } = props;
            const rootPath = process.env.RNV_PROJECT_ROOT || process.cwd();
            if (process.env.RNV_EXTENSIONS) {
                cfg.resolve.extensions = process.env.RNV_EXTENSIONS.split(',')
                    .map((e) => `.${e}`)
                    .filter((ext) => isServer || !ext.includes('server.'));
            }
            // https://github.com/martpie/next-transpile-modules#i-have-trouble-with-duplicated-dependencies-or-the-invalid-hook-call-error-in-react
            if (isServer) {
                // TODO: This breaks non monorepo SSR
                // cfg.externals = ['react', ...cfg.externals];
                cfg.externals = [...cfg.externals];
            }

            cfg.resolve.modules.unshift(path.resolve(rootPath));
            if (process.env.RNV_MODULE_ALIASES) {
                const mAliases = process.env.RNV_MODULE_ALIASES.split(',');
                mAliases.forEach((mAlias) => {
                    const aliasArr = mAlias.split(':');
                    cfg.resolve.alias[aliasArr[0]] = aliasArr[1];
                    // On Windows paths include ':' character (ex. C:\\Folder), so a third
                    // value exists and needs to be appended to path in order to resolve modules
                    if (aliasArr[2]) {
                        cfg.resolve.alias[aliasArr[0]] += `:${aliasArr[2]}`;
                    }
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

            // TODO This feels like haxx //=> THIS BREAKS in Next 12 + Webpack 5
            // if (cfg.module.rules[1].oneOf[5].include && Array.isArray(cfg.module.rules[1].oneOf[5].include.or)) {
            //     cfg.module.rules[1].oneOf[5].include.or = cfg.module.rules[1].oneOf[5].include.or.filter(pth => !!pth);
            // }
            return cfg;
        },
    };
    let transModules: string[] = [];
    // console.log('Transpiled Modules:', process.env.RNV_NEXT_TRANSPILE_MODULES.split(','));
    if (process.env.RNV_NEXT_TRANSPILE_MODULES) {
        transModules = process.env.RNV_NEXT_TRANSPILE_MODULES.split(',');
    }

    const withTM = nextTranspile(transModules);
    let cnf1;
    if (opts?.enableOptimizedImages) {
        // enableOptimizedImages DEPRECATED
        // cnf1 = withExpo(withFonts(withOptimizedImages(withTM(cnf))));
        cnf1 = withExpo(withFonts(withImages(withTM(cnf))));
    } else {
        cnf1 = withExpo(withFonts(withImages(withTM(cnf))));
    }
    // if (opts?.enableNextCss) {
    // enableNextCss DEPRECATED
    //     cnf1 = withCSS(cnf1);
    // }
    if (process.env.RNV_EXTENSIONS) {
        cnf1.pageExtensions = process.env.RNV_EXTENSIONS.split(',');
    }

    return cnf1;
};

export const withRNVBabel = (cnf: any) => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: ['module:babel-preset-expo'],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [process.env.RNV_MONO_ROOT || '.'],
                },
            ],
            ...plugins,
        ],
    };
};
