import { FileStore } from 'metro-cache';
import path from 'path';
import os from 'os';

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const DEFAULT_CONFIG = {
    resolver: {
        assetExts: [
            'bmp',
            'gif',
            'jpg',
            'jpeg',
            'png',
            'psd',
            'svg',
            'webp',
            'm4v',
            'mov',
            'mp4',
            'mpeg',
            'mpg',
            'webm',
            'aac',
            'aiff',
            'caf',
            'm4a',
            'mp3',
            'wav',
            'html',
            'pdf',
            'yaml',
            'yml',
            'otf',
            'ttf',
            'zip',
        ],
        assetResolutions: ['1', '1.5', '2', '3', '4'],
        platforms: ['android', 'ios'],
        sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
        disableHierarchicalLookup: false,
        unstable_enableSymlinks: false,
        emptyModulePath: '../../node_modules/metro-runtime/src/modules/empty-module.js',
        extraNodeModules: {},
        nodeModulesPaths: [],
        resolveRequest: null,
        resolverMainFields: ['react-native', 'browser', 'main'],
        unstable_conditionNames: ['require', 'import', 'react-native'],
        unstable_conditionsByPlatform: {
            web: ['browser'],
        },
        unstable_enablePackageExports: false,
        useWatchman: true,
    },
    serializer: {
        polyfillModuleNames: [],
        customSerializer: null,
    },
    server: {
        port: 8086,
        runInspectorProxy: true,
        unstable_serverRoot: null,
        useGlobalHotkey: true,
        verifyConnections: false,
    },
    symbolicator: {},
    transformer: {
        assetPlugins: [],
        asyncRequireModulePath: '../../node_modules/metro-runtime/src/modules/asyncRequire.js',
        assetRegistryPath: 'react-native-tvos/Libraries/Image/AssetRegistry',
        babelTransformerPath: '../../node_modules/metro-react-native-babel-transformer/src/index.js',
        dynamicDepsInPackages: 'throwAtRuntime',
        enableBabelRCLookup: true,
        enableBabelRuntime: true,
        globalPrefix: '',
        hermesParser: false,
        minifierConfig: {
            mangle: {
                toplevel: false,
            },
            output: {
                ascii_only: true,
                comments: false,
                quote_style: 3,
                wrap_iife: true,
            },
            sourceMap: {
                includeSources: false,
            },
            toplevel: false,
            compress: {
                reduce_funcs: false,
            },
        },
        minifierPath: 'metro-minify-terser',
        optimizationSizeLimit: 153600,
        transformVariants: {
            default: {},
        },
        workerPath: 'metro/src/DeltaBundler/Worker',
        publicPath: '/assets',
        allowOptionalDependencies: true,
        unstable_allowRequireContext: false,
        unstable_dependencyMapReservedName: null,
        unstable_disableModuleWrapping: false,
        unstable_disableNormalizePseudoGlobals: false,
        unstable_compactOutput: false,
    },
    watcher: {
        additionalExts: ['cjs', 'mjs'],
        healthCheck: {
            enabled: false,
            filePrefix: '.metro-health-check',
            interval: 30000,
            timeout: 5000,
        },
        watchman: {
            deferStates: ['hg.update'],
        },
    },
    stickyWorkers: true,
    watchFolders: ['../..'],
    transformerPath: 'metro-transform-worker',
    resetCache: false,
    cacheStores: [
        new FileStore({
            root: path.join(os.tmpdir(), 'metro-cache-tvos'),
        }),
    ],
};

export const withRNVMetro = (config: any) => {
    const projectPath = process.env.RNV_PROJECT_ROOT || process.cwd();
    const cfg = mergeConfig(getDefaultConfig(projectPath), DEFAULT_CONFIG);

    const cnf = mergeConfig(cfg, config);

    return cnf;
};
