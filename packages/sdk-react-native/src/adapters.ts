import merge from 'deepmerge';
import type { ConfigT, InputConfigT } from 'metro-config';

export type InputConfig = InputConfigT;

const getApplicationId = () => {
    const appId = process.env.RNV_APP_ID;
    return appId;
};

const getSkipLinkingDeps = () => {
    const skipLinkingEnv = process.env.RNV_SKIP_LINKING;
    if(skipLinkingEnv){
        const [ platform, ...plugins] = skipLinkingEnv.split(',').map(item => item.trim());

        return {
            dependencies: plugins.reduce((acc, plugin) => {
                acc[`${plugin}`] = {platforms: {
                    [platform]: null
                }};
                return acc;
            }, {} as { [plugin: string]: {platforms: { [platform: string]:null}}})
        }
    }

    return {};
};


const getAppFolderRelative = () => {
    const pth = process.env.RNV_APP_BUILD_DIR;
    if (pth) {
        return pth;
    } else {
        const cwd = process.cwd();
        if (cwd.includes('platformBuilds/')) {
            const dir = process.cwd().split('platformBuilds/')[1];

            return `platformBuilds/${dir}`;
        } else {
            return undefined;
        }
    }
};

const getReactNativePathRelative = () => {
    const rnPath = process.env.RNV_REACT_NATIVE_PATH;
    return rnPath;
};

const getProjectRoot = () => {
    //env: PROJECT_ROOT
    const rnPath = process.env.RNV_PROJECT_ROOT;
    return rnPath;
};

export const withRNVRNConfig = (config: any) => {
    const cnfRnv = {
        root: getProjectRoot(),
        //Required to support 2 react native instances
        reactNativePath: getReactNativePathRelative(),
        dependencies: {
            // Required for Expo CLI to be used with platforms (such as Apple TV) that are not supported in Expo SDK
            expo: {
                platforms: {
                    android: null,
                    ios: null,
                    macos: null,
                },
            },
        },
        project: {
            ios: {
                sourceDir: getAppFolderRelative(),
            },
            android: {
                appName: 'app',
                sourceDir: getAppFolderRelative(),
                packageName: getApplicationId(),
            },
        },
    };

    const updatedCnf = merge(cnfRnv, getSkipLinkingDeps())
    const cnf = merge(updatedCnf, config);
    return cnf;
};

export const withMetroConfig = (projectRoot: string): ConfigT => {
    const INTERNAL_CALLSITES_REGEX = new RegExp(
        [
            '/Libraries/BatchedBridge/MessageQueue\\.js$',
            '/Libraries/Core/.+\\.js$',
            '/Libraries/LogBox/.+\\.js$',
            '/Libraries/Network/.+\\.js$',
            '/Libraries/Pressability/.+\\.js$',
            '/Libraries/Renderer/implementations/.+\\.js$',
            '/Libraries/Utilities/.+\\.js$',
            '/Libraries/vendor/.+\\.js$',
            '/Libraries/WebSocket/.+\\.js$',
            '/Libraries/YellowBox/.+\\.js$',
            '/metro-runtime/.+\\.js$',
            '/node_modules/@babel/runtime/.+\\.js$',
            '/node_modules/event-target-shim/.+\\.js$',
            '/node_modules/invariant/.+\\.js$',
            '/node_modules/react-devtools-core/.+\\.js$',
            '/node_modules/react-native/index.js$',
            '/node_modules/react-refresh/.+\\.js$',
            '/node_modules/scheduler/.+\\.js$',
            '^\\[native code\\]$',
        ].join('|')
    );

    const config = {
        resolver: {
            resolverMainFields: ['react-native', 'browser', 'main'],
            platforms: ['android', 'ios'],
            unstable_conditionNames: ['require', 'import', 'react-native'],
            emptyModulePath: require.resolve('metro-runtime/src/modules/empty-module.js', {
                paths: [process.env.RNV_PROJECT_ROOT || process.cwd()],
            }),
        },
        serializer: {
            // Note: This option is overridden in cli-plugin-metro (getOverrideConfig)
            getModulesRunBeforeMainModule: () => [
                require.resolve('react-native/Libraries/Core/InitializeCore', {
                    paths: [process.env.RNV_PROJECT_ROOT || process.cwd()],
                }),
            ],
            getPolyfills: () =>
                require(require.resolve('@react-native/js-polyfills', {
                    paths: [process.env.RNV_PROJECT_ROOT || process.cwd()],
                }))(),
        },
        server: {
            port: Number(process.env.RCT_METRO_PORT) || 8081,
        },
        symbolicator: {
            customizeFrame: (frame: Readonly<{ file?: string }>) => {
                const collapse = Boolean(frame.file && INTERNAL_CALLSITES_REGEX.test(frame.file));
                return { collapse };
            },
        },
        transformer: {
            allowOptionalDependencies: true,
            assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
            asyncRequireModulePath: require.resolve('metro-runtime/src/modules/asyncRequire', {
                paths: [process.env.RNV_PROJECT_ROOT || process.cwd()],
            }),
            babelTransformerPath: require.resolve('@react-native/metro-babel-transformer'),
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: true,
                },
            }),
        },
        watchFolders: [],
    };
    const { mergeConfig, getDefaultConfig } = require('metro-config');

    return mergeConfig(getDefaultConfig.getDefaultValues(projectRoot), config);
};

export const mergeConfig = (config1: ConfigT, config2: InputConfig) => {
    const mc = require('metro-config');
    return mc.mergeConfig(config1, config2);
};
