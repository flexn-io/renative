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

export const withRNVNext = (config: any) => {
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
    };
    let transModules: string[] = [];

    const cnf1 = withRNWNext(withFonts(withImages(cnf)));

    if (process.env.RNV_EXTENSIONS) {
        cnf1.pageExtensions = process.env.RNV_EXTENSIONS.split(',');
    }
    if (process.env.RNV_NEXT_TRANSPILE_MODULES) {
        transModules = process.env.RNV_NEXT_TRANSPILE_MODULES.split(',');
        cnf1.transpilePackages = transModules;
    }

    return cnf1;
};
