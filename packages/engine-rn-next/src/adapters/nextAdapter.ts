const withImages = require('next-images');
const withFonts = require('next-fonts');
import { Configuration, DefinePlugin } from 'webpack';
import { NextConfig } from 'next';

function _withRNWNext(nextConfig: NextConfig = {}): NextConfig {
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
                    'react-native-web/dist/vendor/react-native/EventEmitter/RCTDeviceEventEmitter',
                'react-native/Libraries/vendor/emitter/EventEmitter$':
                    'react-native-web/dist/vendor/react-native/vendor/emitter/EventEmitter',
                'react-native/Libraries/EventEmitter/NativeEventEmitter$':
                    'react-native-web/dist/vendor/react-native/EventEmitter/NativeEventEmitter',
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

export const withRNVNext = (config: NextConfig) => {
    const cnf = {
        // can be overwritten by user
        distDir: process.env.NEXT_DIST_DIR,
        // end - can be overwritten by user
        ...config,
        images: {
            disableStaticImages: true,
            ...(config?.images || {}),
        },
        webpack: (cfg: Configuration, props: any) => {
            const { isServer } = props;

            if (!cfg.resolve) {
                cfg.resolve = {};
            }
            if (process.env.RNV_EXTENSIONS) {
                cfg.resolve.extensions = process.env.RNV_EXTENSIONS.split(',')
                    .map((e) => `.${e}`)
                    .filter((ext) => isServer || !ext.includes('server.'));
            }
            if (typeof config.webpack === 'function') {
                return config.webpack(cfg, props);
            }
            return cfg;
        },
    };

    if (process.env.NEXT_EXPORT === 'true') {
        cnf.output = 'export';
    }

    let transModules: string[] = [];

    const cnf1 = _withRNWNext(withFonts(withImages(cnf)));

    if (process.env.RNV_EXTENSIONS) {
        cnf1.pageExtensions = process.env.RNV_EXTENSIONS.split(',');
    }
    if (process.env.RNV_NEXT_TRANSPILE_MODULES) {
        transModules = process.env.RNV_NEXT_TRANSPILE_MODULES.split(',');
        cnf1.transpilePackages = transModules;
    }

    return cnf1;
};
