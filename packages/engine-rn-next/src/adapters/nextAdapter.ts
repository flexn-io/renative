const withImages = require('next-images');
const withFonts = require('next-fonts');
import { Configuration, DefinePlugin } from 'webpack';

export function withRNWNext(nextConfig: any = {}): any {
    return {
        ...nextConfig,
        webpack(config: Configuration, options: any): Configuration {
            // Mix in aliases
            if (!config.resolve) {
                config.resolve = {};
            }

            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                // Alias direct react-native imports to react-native-web
                'react-native$': 'react-native-web',
                // Alias internal react-native modules to react-native-web
                'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
                    'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
                'react-native/Libraries/vendor/emitter/EventEmitter$':
                    'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
                'react-native/Libraries/EventEmitter/NativeEventEmitter$':
                    'react-native-web/dist/vendor/react-native/NativeEventEmitter',
            };

            config.resolve.extensions = [
                '.web.js',
                '.web.jsx',
                '.web.ts',
                '.web.tsx',
                ...(config.resolve?.extensions ?? []),
            ];

            if (!config.plugins) {
                config.plugins = [];
            }

            // Expose __DEV__ from Metro.
            config.plugins.push(
                new DefinePlugin({
                    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
                })
            );

            // Execute the user-defined webpack config.
            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options);
            }

            return config;
        },
    };
}

//TODO: https://turbo.build/pack/docs/features/customizing-turbopack

export const withRNVNext = (config: any, opts: any) => {
    const cnf = {
        ...config,
        images: {
            disableStaticImages: true,
            ...(config?.images || {}),
        },
        distDir: process.env.NEXT_DIST_DIR,
        webpack: (cfg: any, props: any) => {
            const { isServer } = props;
            if (process.env.RNV_EXTENSIONS) {
                cfg.resolve.extensions = process.env.RNV_EXTENSIONS.split(',')
                    .map((e) => `.${e}`)
                    .filter((ext) => isServer || !ext.includes('server.'));
            }
            return cfg;
        },
        // webpack: (cfg: any, props: any) => {
        //     const { isServer } = props;
        //     const rootPath = process.env.RNV_PROJECT_ROOT || process.cwd();
        //     if (process.env.RNV_EXTENSIONS) {
        //         cfg.resolve.extensions = process.env.RNV_EXTENSIONS.split(',')
        //             .map((e) => `.${e}`)
        //             .filter((ext) => isServer || !ext.includes('server.'));
        //     }
        //     // https://github.com/martpie/next-transpile-modules#i-have-trouble-with-duplicated-dependencies-or-the-invalid-hook-call-error-in-react
        //     if (isServer) {
        //         // TODO: This breaks non monorepo SSR
        //         // cfg.externals = ['react', ...cfg.externals];
        //         cfg.externals = [...cfg.externals];
        //     }

        //     cfg.resolve.modules.unshift(path.resolve(rootPath));
        //     if (process.env.RNV_MODULE_ALIASES) {
        //         const mAliases = process.env.RNV_MODULE_ALIASES.split(',');
        //         mAliases.forEach((mAlias) => {
        //             const aliasArr = mAlias.split(':');
        //             cfg.resolve.alias[aliasArr[0]] = aliasArr[1];
        //             // On Windows paths include ':' character (ex. C:\\Folder), so a third
        //             // value exists and needs to be appended to path in order to resolve modules
        //             if (aliasArr[2]) {
        //                 cfg.resolve.alias[aliasArr[0]] += `:${aliasArr[2]}`;
        //             }
        //         });
        //     }
        //     cfg.module.rules[0].test = /\.(tsx|ts|js|mjs|jsx)$/;
        //     // cfg.module.rules.push({
        //     //     test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        //     //     use: {
        //     //         loader: 'url-loader',
        //     //         options: {
        //     //             limit: 100000,
        //     //             name: '[name].[ext]',
        //     //         },
        //     //     },
        //     // });
        //     if (typeof config.webpack === 'function') {
        //         return config.webpack(cfg, props);
        //     }

        //     // TODO This feels like haxx //=> THIS BREAKS in Next 12 + Webpack 5
        //     // if (cfg.module.rules[1].oneOf[5].include && Array.isArray(cfg.module.rules[1].oneOf[5].include.or)) {
        //     //     cfg.module.rules[1].oneOf[5].include.or = cfg.module.rules[1].oneOf[5].include.or.filter(pth => !!pth);
        //     // }
        //     return cfg;
        // },
    };
    let transModules: string[] = [];
    // console.log('Transpiled Modules:', process.env.RNV_NEXT_TRANSPILE_MODULES.split(','));

    // const withTM = nextTranspile(transModules);
    let cnf1;
    if (opts?.enableOptimizedImages) {
        // enableOptimizedImages DEPRECATED
        // cnf1 = withExpo(withFonts(withOptimizedImages(withTM(cnf))));
        // cnf1 = withExpo(withFonts(withImages(withTM(cnf))));
        cnf1 = withRNWNext(withFonts(withImages(cnf)));
    } else {
        // cnf1 = withExpo(withFonts(withImages(withTM(cnf))));
        cnf1 = withRNWNext(withFonts(withImages(cnf)));
    }
    // if (opts?.enableNextCss) {
    // enableNextCss DEPRECATED
    //     cnf1 = withCSS(cnf1);
    // }
    if (process.env.RNV_EXTENSIONS) {
        cnf1.pageExtensions = process.env.RNV_EXTENSIONS.split(',');
    }
    if (process.env.RNV_NEXT_TRANSPILE_MODULES) {
        transModules = process.env.RNV_NEXT_TRANSPILE_MODULES.split(',');
        cnf1.transpilePackages = transModules;
    }

    return cnf1;
};
