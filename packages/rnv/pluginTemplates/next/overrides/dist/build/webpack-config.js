"use strict";
exports.__esModule = true;
exports.default = getBaseWebpackConfig;
var _chalk = _interopRequireDefault( require( "chalk" ) );
var _crypto = _interopRequireDefault( require( "crypto" ) );
var _forkTsCheckerWebpackPlugin = _interopRequireDefault( require( "fork-ts-checker-webpack-plugin" ) );
var _path = _interopRequireDefault( require( "path" ) );
var _pnpWebpackPlugin = _interopRequireDefault( require( "pnp-webpack-plugin" ) );
var _webpack = _interopRequireDefault( require( "webpack" ) );
var _constants = require( "../lib/constants" );
var _fileExists = require( "../lib/file-exists" );
var _resolveRequest = require( "../lib/resolve-request" );
var _constants2 = require( "../next-server/lib/constants" );
var _findPageFile = require( "../server/lib/find-page-file" );
var _collectPlugins = require( "./plugins/collect-plugins" );
var _config = require( "./webpack/config" );
var _overrideCssConfiguration = require( "./webpack/config/blocks/css/overrideCssConfiguration" );
var _nextPluginLoader = require( "./webpack/loaders/next-plugin-loader" );
var _buildManifestPlugin = _interopRequireDefault( require( "./webpack/plugins/build-manifest-plugin" ) );
var _chunkNamesPlugin = _interopRequireDefault( require( "./webpack/plugins/chunk-names-plugin" ) );
var _cssMinimizerPlugin = require( "./webpack/plugins/css-minimizer-plugin" );
var _dllImport = require( "./webpack/plugins/dll-import" );
var _nextDropClientPagePlugin = require( "./webpack/plugins/next-drop-client-page-plugin" );
var _nextEsmPlugin = _interopRequireDefault( require( "./webpack/plugins/next-esm-plugin" ) );
var _nextjsSsrImport = _interopRequireDefault( require( "./webpack/plugins/nextjs-ssr-import" ) );
var _nextjsSsrModuleCache = _interopRequireDefault( require( "./webpack/plugins/nextjs-ssr-module-cache" ) );
var _pagesManifestPlugin = _interopRequireDefault( require( "./webpack/plugins/pages-manifest-plugin" ) );
var _profilingPlugin = require( "./webpack/plugins/profiling-plugin" );
var _reactLoadablePlugin = require( "./webpack/plugins/react-loadable-plugin" );
var _serverlessPlugin = require( "./webpack/plugins/serverless-plugin" );
var _index = require( "./webpack/plugins/terser-webpack-plugin/src/index" );
var _webpackConformancePlugin = _interopRequireWildcard( require( "./webpack/plugins/webpack-conformance-plugin" ) );

function _getRequireWildcardCache() {
    if ( typeof WeakMap !== "function" ) return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function () {
        return cache;
    };
    return cache;
}

function _interopRequireWildcard( obj ) {
    if ( obj && obj.__esModule ) {
        return obj;
    }
    if ( obj === null || typeof obj !== "object" && typeof obj !== "function" ) {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if ( cache && cache.has( obj ) ) {
        return cache.get( obj );
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for ( var key in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, key ) ) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor( obj, key ) : null;
            if ( desc && ( desc.get || desc.set ) ) {
                Object.defineProperty( newObj, key, desc );
            }
            else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if ( cache ) {
        cache.set( obj, newObj );
    }
    return newObj;
}

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj :
        {
            default: obj
        };
}
const escapePathVariables = value => {
    return typeof value === 'string' ? value.replace( /\[(\\*[\w:]+\\*)\]/gi, '[\\$1\\]' ) : value;
};

function getOptimizedAliases( isServer ) {
    if ( isServer ) {
        return {};
    }
    const stubWindowFetch = _path.default.join( __dirname, 'polyfills', 'fetch', 'index.js' );
    const stubObjectAssign = _path.default.join( __dirname, 'polyfills', 'object-assign.js' );
    const shimAssign = _path.default.join( __dirname, 'polyfills', 'object.assign' );
    return Object.assign(
        {},
        {
            unfetch$: stubWindowFetch,
            'isomorphic-unfetch$': stubWindowFetch,
            'whatwg-fetch$': _path.default.join( __dirname, 'polyfills', 'fetch', 'whatwg-fetch.js' )
        },
        {
            'object-assign$': stubObjectAssign, // Stub Package: object.assign
            'object.assign/auto': _path.default.join( shimAssign, 'auto.js' ),
            'object.assign/implementation': _path.default.join( shimAssign, 'implementation.js' ),
            'object.assign$': _path.default.join( shimAssign, 'index.js' ),
            'object.assign/polyfill': _path.default.join( shimAssign, 'polyfill.js' ),
            'object.assign/shim': _path.default.join( shimAssign, 'shim.js' ), // Replace: full URL polyfill with platform-based polyfill
            url: require.resolve( 'native-url' )
        } );
}
async function getBaseWebpackConfig( dir,
    {
        buildId,
        config,
        dev = false,
        isServer = false,
        pagesDir,
        tracer,
        target = 'server',
        entrypoints
    } ) {
    var _config$typescript, _config$typescript2, _config$conformance, _config$conformance$D;
    let plugins = [];
    let babelPresetPlugins = [];
    if ( config.experimental.plugins ) {
        plugins = await ( 0, _collectPlugins.collectPlugins )( dir, config.env, config.plugins );
        _nextPluginLoader.pluginLoaderOptions.plugins = plugins;
        for ( const plugin of plugins ) {
            if ( plugin.middleware.includes( 'babel-preset-build' ) ) {
                babelPresetPlugins.push(
                    {
                        dir: plugin.directory,
                        config: plugin.config
                    } );
            }
        }
    }
    const distDir = _path.default.join( dir, config.distDir );
    const defaultLoaders = {
        babel:
        {
            loader: 'next-babel-loader',
            options:
            {
                isServer,
                distDir,
                pagesDir,
                cwd: dir,
                cache: true,
                babelPresetPlugins,
                hasModern: !!config.experimental.modern,
                development: dev
            }
        }, // Backwards compat
        hotSelfAccept:
        {
            loader: 'noop-loader'
        }
    };
    const babelIncludeRegexes = [/next[\\/]dist[\\/]next-server[\\/]lib/, /next[\\/]dist[\\/]client/, /next[\\/]dist[\\/]pages/, /[\\/](strip-ansi|ansi-regex)[\\/]/, ...( config.experimental.plugins ? _collectPlugins.VALID_MIDDLEWARE.map( name => new RegExp( `src(\\\\|/)${name}` ) ) : [] )]; // Support for NODE_PATH
    const nodePathList = ( process.env.NODE_PATH || '' ).split( process.platform === 'win32' ? ';' : ':' ).filter( p => !!p );
    const isServerless = target === 'serverless';
    const isServerlessTrace = target === 'experimental-serverless-trace'; // Intentionally not using isTargetLikeServerless helper
    const isLikeServerless = isServerless || isServerlessTrace;
    const outputDir = isLikeServerless ? _constants2.SERVERLESS_DIRECTORY : _constants2.SERVER_DIRECTORY;
    const outputPath = _path.default.join( distDir, isServer ? outputDir : '' );
    const totalPages = Object.keys( entrypoints ).length;
    const clientEntries = !isServer ?
        { // Backwards compatibility
            'main.js': [],
            [_constants2.CLIENT_STATIC_FILES_RUNTIME_MAIN]: `.${_path.default.sep}` + _path.default.relative( dir, _path.default.join( _constants.NEXT_PROJECT_ROOT_DIST_CLIENT, dev ? `next-dev.js` : 'next.js' ) ),
            [_constants2.CLIENT_STATIC_FILES_RUNTIME_POLYFILLS]: _path.default.join( _constants.NEXT_PROJECT_ROOT_DIST_CLIENT, 'polyfills.js' )
        } : undefined;
    let typeScriptPath;
    try {
        typeScriptPath = ( 0, _resolveRequest.resolveRequest )( 'typescript', `${dir}/` );
    }
    catch ( _ ) { }
    const tsConfigPath = _path.default.join( dir, 'tsconfig.json' );
    const useTypeScript = Boolean( typeScriptPath && ( await ( 0, _fileExists.fileExists )( tsConfigPath ) ) );
    const ignoreTypeScriptErrors = dev ? ( _config$typescript = config.typescript ) === null || _config$typescript === void 0 ? void 0 : _config$typescript.ignoreDevErrors : ( _config$typescript2 = config.typescript ) === null || _config$typescript2 === void 0 ? void 0 : _config$typescript2.ignoreBuildErrors;
    const rnvExtensions = config.pageExtensionsRnv;
    const rnvExtensionsWitMjsSwapped = config.pageExtensionsRnv.filter( e => !e.includes( '.mjs' ) );
    rnvExtensionsWitMjsSwapped.splice( rnvExtensionsWitMjsSwapped.indexOf( '.js' ) + 1, 0, '.mjs' );
    const resolveConfig = { // Disable .mjs for node_modules bundling
        extensions: isServer ? [...( useTypeScript ? ['.tsx', '.ts'] : [] ), '.js', '.mjs', '.jsx', '.json', '.wasm'] : [...( useTypeScript ? ['.tsx', '.ts'] : [] ), '.mjs', '.js', '.jsx', '.json', '.wasm'],
        modules: ['node_modules', ...nodePathList // Support for NODE_PATH environment variable
        ],
        alias:
        { // These aliases make sure the wrapper module is not included in the bundles
            // Which makes bundles slightly smaller, but also skips parsing a module that we know will result in this alias
            'next/head': 'next/dist/next-server/lib/head.js',
            'next/router': 'next/dist/client/router.js',
            'next/config': 'next/dist/next-server/lib/runtime-config.js',
            'next/dynamic': 'next/dist/next-server/lib/dynamic.js',
            next: _constants.NEXT_PROJECT_ROOT,
            [_constants.PAGES_DIR_ALIAS]: pagesDir,
            [_constants.DOT_NEXT_ALIAS]: distDir,
            ...getOptimizedAliases( isServer )
        },
        mainFields: isServer ? ['main', 'module'] : ['browser', 'module', 'main'],
        plugins: [_pnpWebpackPlugin.default]
    };
    const webpackMode = dev ? 'development' : 'production';
    const terserPluginConfig = {
        cache: true,
        cpus: config.experimental.cpus,
        distDir: distDir,
        parallel: true,
        sourceMap: false,
        workerThreads: config.experimental.workerThreads
    };
    const terserOptions = {
        parse:
        {
            ecma: 8
        },
        compress:
        {
            ecma: 5,
            warnings: false, // The following two options are known to break valid JavaScript code
            comparisons: false,
            inline: 2 // https://github.com/zeit/next.js/issues/7178#issuecomment-493048965
        },
        mangle:
        {
            safari10: true
        },
        output:
        {
            ecma: 5,
            safari10: true,
            comments: false, // Fixes usage of Emoji and certain Regex
            ascii_only: true
        }
    };
    const devtool = dev ? 'cheap-module-source-map' : false;
    const isModuleCSS = module => {
        return ( // mini-css-extract-plugin
            module.type === `css/mini-extract` || // extract-css-chunks-webpack-plugin (old)
            module.type === `css/extract-chunks` || // extract-css-chunks-webpack-plugin (new)
            module.type === `css/extract-css-chunks` );
    }; // Contains various versions of the Webpack SplitChunksPlugin used in different build types
    const splitChunksConfigs = {
        dev:
        {
            cacheGroups:
            {
                default: false,
                vendors: false
            }
        },
        prod:
        {
            chunks: 'all',
            cacheGroups:
            {
                default: false,
                vendors: false,
                commons:
                {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: totalPages > 2 ? totalPages * 0.5 : 2
                },
                react:
                {
                    name: 'commons',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](react|react-dom|scheduler|use-subscription)[\\/]/
                }
            }
        },
        prodGranular:
        {
            chunks: 'all',
            cacheGroups:
            {
                default: false,
                vendors: false,
                framework:
                {
                    chunks: 'all',
                    name: 'framework', // This regex ignores nested copies of framework libraries so they're
                    // bundled with their issuer.
                    // https://github.com/zeit/next.js/pull/9012
                    test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
                    priority: 40, // Don't let webpack eliminate this chunk (prevents this chunk from
                    // becoming a part of the commons chunk)
                    enforce: true
                },
                lib:
                {
                    test( module ) {
                        return module.size() > 160000 && /node_modules[/\\]/.test( module.identifier() );
                    },
                    name( module ) {
                        const hash = _crypto.default.createHash( 'sha1' );
                        if ( isModuleCSS( module ) ) {
                            module.updateHash( hash );
                        }
                        else {
                            if ( !module.libIdent ) {
                                throw new Error( `Encountered unknown module type: ${module.type}. Please open an issue.` );
                            }
                            hash.update( module.libIdent(
                                {
                                    context: dir
                                } ) );
                        }
                        return hash.digest( 'hex' ).substring( 0, 8 );
                    },
                    priority: 30,
                    minChunks: 1,
                    reuseExistingChunk: true
                },
                commons:
                {
                    name: 'commons',
                    minChunks: totalPages,
                    priority: 20
                },
                shared:
                {
                    name( module, chunks ) {
                        return _crypto.default.createHash( 'sha1' ).update( chunks.reduce( ( acc, chunk ) => {
                            return acc + chunk.name;
                        }, '' ) ).digest( 'hex' ) + ( isModuleCSS( module ) ? '_CSS' : '' );
                    },
                    priority: 10,
                    minChunks: 2,
                    reuseExistingChunk: true
                }
            },
            maxInitialRequests: 25,
            minSize: 20000
        }
    }; // Select appropriate SplitChunksPlugin config for this build
    let splitChunksConfig;
    if ( dev ) {
        splitChunksConfig = splitChunksConfigs.dev;
    }
    else {
        splitChunksConfig = config.experimental.granularChunks ? splitChunksConfigs.prodGranular : splitChunksConfigs.prod;
    }
    const crossOrigin = !config.crossOrigin && config.experimental.modern ? 'anonymous' : config.crossOrigin;
    let customAppFile = config.experimental.css ? await ( 0, _findPageFile.findPageFile )( pagesDir, '/_app', config.pageExtensions ) : null;
    if ( customAppFile ) {
        customAppFile = _path.default.resolve( _path.default.join( pagesDir, customAppFile ) );
    }
    const conformanceConfig = Object.assign(
        {
            ReactSyncScriptsConformanceCheck:
            {
                enabled: true
            },
            MinificationConformanceCheck:
            {
                enabled: true
            },
            DuplicatePolyfillsConformanceCheck:
            {
                enabled: true,
                BlockedAPIToBePolyfilled: Object.assign( [], ['fetch'], ( ( _config$conformance = config.conformance ) === null || _config$conformance === void 0 ? void 0 : ( _config$conformance$D = _config$conformance.DuplicatePolyfillsConformanceCheck ) === null || _config$conformance$D === void 0 ? void 0 : _config$conformance$D.BlockedAPIToBePolyfilled ) || [] )
            }
        }, config.conformance );
    let webpackConfig = {
        externals: !isServer ? undefined : !isServerless ? [( context, request, callback ) => {
            const notExternalModules = ['next/app', 'next/document', 'next/link', 'next/error', 'string-hash', 'next/constants'];
            if ( notExternalModules.indexOf( request ) !== -1 ) {
                return callback();
            } // make sure we don't externalize anything that is
            // supposed to be transpiled
            if ( babelIncludeRegexes.some( r => r.test( request ) ) ) {
                return callback();
            } // Relative requires don't need custom resolution, because they
            // are relative to requests we've already resolved here.
            // Absolute requires (require('/foo')) are extremely uncommon, but
            // also have no need for customization as they're already resolved.
            if ( request.startsWith( '.' ) || request.startsWith( '/' ) ) {
                return callback();
            } // Resolve the import with the webpack provided context, this
            // ensures we're resolving the correct version when multiple
            // exist.
            let res;
            try {
                res = ( 0, _resolveRequest.resolveRequest )( request, `${context}/` );
            }
            catch ( err ) { // If the request cannot be resolved, we need to tell webpack to
                // "bundle" it so that webpack shows an error (that it cannot be
                // resolved).
                return callback();
            } // Same as above, if the request cannot be resolved we need to have
            // webpack "bundle" it so it surfaces the not found error.
            if ( !res ) {
                return callback();
            } // Bundled Node.js code is relocated without its node_modules tree.
            // This means we need to make sure its request resolves to the same
            // package that'll be available at runtime. If it's not identical,
            // we need to bundle the code (even if it _should_ be external).
            let baseRes;
            try {
                baseRes = ( 0, _resolveRequest.resolveRequest )( request, `${dir}/` );
            }
            catch ( err ) { } // Same as above: if the package, when required from the root,
            // would be different from what the real resolution would use, we
            // cannot externalize it.
            if ( baseRes !== res ) {
                return callback();
            } // Default pages have to be transpiled
            if ( !res.match( /next[/\\]dist[/\\]next-server[/\\]/ ) && ( res.match( /[/\\]next[/\\]dist[/\\]/ ) || // This is the @babel/plugin-transform-runtime "helpers: true" option
                res.match( /node_modules[/\\]@babel[/\\]runtime[/\\]/ ) ) ) {
                return callback();
            } // Webpack itself has to be compiled because it doesn't always use module relative paths
            if ( res.match( /node_modules[/\\]webpack/ ) || res.match( /node_modules[/\\]css-loader/ ) ) {
                return callback();
            } // Anything else that is standard JavaScript within `node_modules`
            // can be externalized.
            if ( res.match( /node_modules[/\\].*\.js$/ ) ) {
                return callback( undefined, `commonjs ${request}` );
            } // Default behavior: bundle the code!
            callback();
        }] : [ // When the 'serverless' target is used all node_modules will be compiled into the output bundles
                // So that the 'serverless' bundles have 0 runtime dependencies
                '@ampproject/toolbox-optimizer' // except this one
            ],
        optimization:
        {
            checkWasmTypes: false,
            nodeEnv: false,
            splitChunks: isServer ? false : splitChunksConfig,
            runtimeChunk: isServer ? undefined :
                {
                    name: _constants2.CLIENT_STATIC_FILES_RUNTIME_WEBPACK
                },
            minimize: !( dev || isServer ),
            minimizer: [ // Minify JavaScript
                new _index.TerserPlugin(
                    {
                        ...terserPluginConfig,
                        terserOptions
                    } ), // Minify CSS
                config.experimental.css && new _cssMinimizerPlugin.CssMinimizerPlugin(
                    {
                        postcssOptions:
                        {
                            map:
                            { // `inline: false` generates the source map in a separate file.
                                // Otherwise, the CSS file is needlessly large.
                                inline: false, // `annotation: false` skips appending the `sourceMappingURL`
                                // to the end of the CSS file. Webpack already handles this.
                                annotation: false
                            }
                        }
                    } )
            ].filter( Boolean )
        },
        context: dir,
        node:
        {
            setImmediate: false
        }, // Kept as function to be backwards compatible
        entry: async () => {
            return {
                ...( clientEntries ? clientEntries :
                    {} ),
                ...entrypoints,
                ...( isServer ?
                    {
                        'init-server.js': 'next-plugin-loader?middleware=on-init-server!',
                        'on-error-server.js': 'next-plugin-loader?middleware=on-error-server!'
                    } :
                    {} )
            };
        },
        output:
        {
            path: outputPath,
            filename: (
                {
                    chunk
                } ) => { // Use `[name]-[contenthash].js` in production
                if ( !dev && ( chunk.name === _constants2.CLIENT_STATIC_FILES_RUNTIME_MAIN || chunk.name === _constants2.CLIENT_STATIC_FILES_RUNTIME_WEBPACK || chunk.name === _constants2.CLIENT_STATIC_FILES_RUNTIME_POLYFILLS ) ) {
                    return chunk.name.replace( /\.js$/, '-[contenthash].js' );
                }
                return '[name]';
            },
            libraryTarget: isServer ? 'commonjs2' : 'var',
            hotUpdateChunkFilename: 'static/webpack/[id].[hash].hot-update.js',
            hotUpdateMainFilename: 'static/webpack/[hash].hot-update.json', // This saves chunks with the name given via `import()`
            chunkFilename: isServer ? `${dev ? '[name]' : '[name].[contenthash]'}.js` : `static/chunks/${dev ? '[name]' : '[name].[contenthash]'}.js`,
            strictModuleExceptionHandling: true,
            crossOriginLoading: crossOrigin,
            futureEmitAssets: !dev,
            webassemblyModuleFilename: 'static/wasm/[modulehash].wasm'
        },
        performance: false,
        resolve: resolveConfig,
        resolveLoader:
        { // The loaders Next.js provides
            alias: ['emit-file-loader', 'error-loader', 'next-babel-loader', 'next-client-pages-loader', 'next-data-loader', 'next-serverless-loader', 'noop-loader', 'next-plugin-loader'].reduce( ( alias, loader ) => { // using multiple aliases to replace `resolveLoader.modules`
                alias[loader] = _path.default.join( __dirname, 'webpack', 'loaders', loader );
                return alias;
            },
                {} ),
            modules: ['node_modules', ...nodePathList // Support for NODE_PATH environment variable
            ],
            plugins: [_pnpWebpackPlugin.default]
        },
        module:
        {
            rules: [
                {
                    test: /\.(tsx|ts|js|mjs|jsx)$/,
                    include: [dir, ...babelIncludeRegexes],
                    exclude: path => {
                        if ( babelIncludeRegexes.some( r => r.test( path ) ) ) {
                            return false;
                        }
                        return /node_modules/.test( path );
                    },
                    use: config.experimental.babelMultiThread ? [ // Move Babel transpilation into a thread pool (2 workers, unlimited batch size).
                        // Applying a cache to the off-thread work avoids paying transfer costs for unchanged modules.
                        {
                            loader: 'cache-loader',
                            options:
                            {
                                cacheContext: dir,
                                cacheDirectory: _path.default.join( dir, '.next', 'cache', 'webpack' ),
                                cacheIdentifier: `webpack${isServer ? '-server' : ''}${config.experimental.modern ? '-hasmodern' : ''}`
                            }
                        },
                        {
                            loader: 'thread-loader',
                            options:
                            {
                                workers: 2,
                                workerParallelJobs: Infinity
                            }
                        },
                        defaultLoaders.babel
                    ] : defaultLoaders.babel
                }].filter( Boolean )
        },
        plugins: [ // This plugin makes sure `output.filename` is used for entry chunks
            new _chunkNamesPlugin.default(), new _webpack.default.DefinePlugin(
                {
                    ...Object.keys( config.env ).reduce( ( acc, key ) => {
                        if ( /^(?:NODE_.+)|^(?:__.+)$/i.test( key ) ) {
                            throw new Error( `The key "${key}" under "env" in next.config.js is not allowed. https://err.sh/zeit/next.js/env-key-not-allowed` );
                        }
                        return {
                            ...acc,
                            [`process.env.${key}`]: JSON.stringify( config.env[key] )
                        };
                    },
                        {} ),
                    'process.env.NODE_ENV': JSON.stringify( webpackMode ),
                    'process.crossOrigin': JSON.stringify( crossOrigin ),
                    'process.browser': JSON.stringify( !isServer ),
                    'process.env.__NEXT_TEST_MODE': JSON.stringify( process.env.__NEXT_TEST_MODE ), // This is used in client/dev-error-overlay/hot-dev-client.js to replace the dist directory
                    ...( dev && !isServer ?
                        {
                            'process.env.__NEXT_DIST_DIR': JSON.stringify( distDir )
                        } :
                        {} ),
                    'process.env.__NEXT_EXPORT_TRAILING_SLASH': JSON.stringify( config.exportTrailingSlash ),
                    'process.env.__NEXT_MODERN_BUILD': JSON.stringify( config.experimental.modern && !dev ),
                    'process.env.__NEXT_GRANULAR_CHUNKS': JSON.stringify( config.experimental.granularChunks && !dev ),
                    'process.env.__NEXT_BUILD_INDICATOR': JSON.stringify( config.devIndicators.buildActivity ),
                    'process.env.__NEXT_PRERENDER_INDICATOR': JSON.stringify( config.devIndicators.autoPrerender ),
                    'process.env.__NEXT_PLUGINS': JSON.stringify( config.experimental.plugins ),
                    'process.env.__NEXT_STRICT_MODE': JSON.stringify( config.reactStrictMode ),
                    'process.env.__NEXT_REACT_MODE': JSON.stringify( config.experimental.reactMode ),
                    'process.env.__NEXT_ROUTER_BASEPATH': JSON.stringify( config.experimental.basePath ),
                    ...( isServer ?
                        { // Fix bad-actors in the npm ecosystem (e.g. `node-formidable`)
                            // This is typically found in unmaintained modules from the
                            // pre-webpack era (common in server-side code)
                            'global.GENTLY': JSON.stringify( false )
                        } : undefined )
                } ), !isServer && new _reactLoadablePlugin.ReactLoadablePlugin(
                    {
                        filename: _constants2.REACT_LOADABLE_MANIFEST
                    } ), !isServer && new _nextDropClientPagePlugin.DropClientPage(), // Moment.js is an extremely popular library that bundles large locale files
            // by default due to how Webpack interprets its code. This is a practical
            // solution that requires the user to opt into importing specific locales.
            // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            config.future.excludeDefaultMomentLocales && new _webpack.default.IgnorePlugin( /^\.\/locale$/, /moment$/ ), ...( dev ? ( () => { // Even though require.cache is server only we have to clear assets from both compilations
                // This is because the client compilation generates the build manifest that's used on the server side
                const
                    {
                        NextJsRequireCacheHotReloader
                    } = require( './webpack/plugins/nextjs-require-cache-hot-reloader' );
                const
                    {
                        UnlinkRemovedPagesPlugin
                    } = require( './webpack/plugins/unlink-removed-pages-plugin' );
                const devPlugins = [new UnlinkRemovedPagesPlugin(), new _webpack.default.NoEmitOnErrorsPlugin(), new NextJsRequireCacheHotReloader()];
                if ( !isServer ) {
                    const AutoDllPlugin = ( 0, _dllImport.importAutoDllPlugin )(
                        {
                            distDir
                        } );
                    devPlugins.push( new AutoDllPlugin(
                        {
                            filename: '[name]_[hash].js',
                            path: './static/development/dll',
                            context: dir,
                            entry:
                            {
                                dll: ['react', 'react-dom']
                            },
                            config:
                            {
                                devtool,
                                mode: webpackMode,
                                resolve: resolveConfig
                            }
                        } ) );
                    devPlugins.push( new _webpack.default.HotModuleReplacementPlugin() );
                }
                return devPlugins;
            } )() : [] ), !dev && new _webpack.default.HashedModuleIdsPlugin(), !dev && new _webpack.default.IgnorePlugin(
                {
                    checkResource: resource => {
                        return /react-is/.test( resource );
                    },
                    checkContext: context => {
                        return /next-server[\\/]dist[\\/]/.test( context ) || /next[\\/]dist[\\/]/.test( context );
                    }
                } ), isServerless && isServer && new _serverlessPlugin.ServerlessPlugin(), isServer && new _pagesManifestPlugin.default( isLikeServerless ), target === 'server' && isServer && new _nextjsSsrModuleCache.default(
                    {
                        outputPath
                    } ), isServer && new _nextjsSsrImport.default(), !isServer && new _buildManifestPlugin.default(
                        {
                            buildId,
                            clientManifest: config.experimental.granularChunks,
                            modern: config.experimental.modern
                        } ), tracer && new _profilingPlugin.ProfilingPlugin(
                            {
                                tracer
                            } ), !isServer && useTypeScript && !ignoreTypeScriptErrors && new _forkTsCheckerWebpackPlugin.default( _pnpWebpackPlugin.default.forkTsCheckerOptions(
                                {
                                    typescript: typeScriptPath,
                                    async: dev,
                                    useTypescriptIncrementalApi: true,
                                    checkSyntacticErrors: true,
                                    tsconfig: tsConfigPath,
                                    reportFiles: ['**', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
                                    compilerOptions:
                                    {
                                        isolatedModules: true,
                                        noEmit: true
                                    },
                                    silent: true,
                                    formatter: 'codeframe'
                                } ) ), config.experimental.modern && !isServer && !dev && new _nextEsmPlugin.default(
                                    {
                                        filename: getFileName => ( ...args ) => {
                                            const name = typeof getFileName === 'function' ? getFileName( ...args ) : getFileName;
                                            return name.includes( '.js' ) ? name.replace( /\.js$/, '.module.js' ) : escapePathVariables( args[0].chunk.name.replace( /\.js$/, '.module.js' ) );
                                        },
                                        chunkFilename: inputChunkName => inputChunkName.replace( /\.js$/, '.module.js' )
                                    } ), config.experimental.conformance && !dev && new _webpackConformancePlugin.default(
                                        {
                                            tests: [!isServer && conformanceConfig.MinificationConformanceCheck.enabled && new _webpackConformancePlugin.MinificationConformanceCheck(), conformanceConfig.ReactSyncScriptsConformanceCheck.enabled && new _webpackConformancePlugin.ReactSyncScriptsConformanceCheck(
                                                {
                                                    AllowedSources: conformanceConfig.ReactSyncScriptsConformanceCheck.allowedSources || []
                                                } ), !isServer && conformanceConfig.DuplicatePolyfillsConformanceCheck.enabled && new _webpackConformancePlugin.DuplicatePolyfillsConformanceCheck(
                                                    {
                                                        BlockedAPIToBePolyfilled: conformanceConfig.DuplicatePolyfillsConformanceCheck.BlockedAPIToBePolyfilled
                                                    } )].filter( Boolean )
                                        } )
        ].filter( Boolean )
    };
    webpackConfig = await ( 0, _config.build )( webpackConfig,
        {
            rootDirectory: dir,
            customAppFile,
            isDevelopment: dev,
            isServer,
            hasSupportCss: !!config.experimental.css,
            hasSupportScss: !!config.experimental.scss,
            assetPrefix: config.assetPrefix || '',
            sassOptions: config.experimental.sassOptions
        } );
    if ( typeof config.webpack === 'function' ) {
        webpackConfig = config.webpack( webpackConfig,
            {
                dir,
                dev,
                isServer,
                buildId,
                config,
                defaultLoaders,
                totalPages,
                webpack: _webpack.default
            } );
        if ( typeof webpackConfig.then === 'function' ) {
            console.warn( '> Promise returned in next config. https://err.sh/zeit/next.js/promise-in-next-config' );
        }
    }

    function canMatchCss( rule ) {
        if ( !rule ) {
            return false;
        }
        const fileNames = ['/tmp/test.css', '/tmp/test.scss', '/tmp/test.sass', '/tmp/test.less', '/tmp/test.styl'];
        if ( rule instanceof RegExp && fileNames.some( input => rule.test( input ) ) ) {
            return true;
        }
        if ( typeof rule === 'function' ) {
            if ( fileNames.some( input => {
                try {
                    if ( rule( input ) ) {
                        return true;
                    }
                }
                catch ( _ ) { }
                return false;
            } ) ) {
                return true;
            }
        }
        if ( Array.isArray( rule ) && rule.some( canMatchCss ) ) {
            return true;
        }
        return false;
    }
    if ( config.experimental.css ) {
        var _ref, _webpackConfig$module;
        const hasUserCssConfig = ( _ref = ( _webpackConfig$module = webpackConfig.module ) === null || _webpackConfig$module === void 0 ? void 0 : _webpackConfig$module.rules.some( rule => canMatchCss( rule.test ) || canMatchCss( rule.include ) ) ) !== null && _ref !== void 0 ? _ref : false;
        if ( hasUserCssConfig ) {
            var _webpackConfig$module2, _webpackConfig$plugin, _webpackConfig$optimi, _webpackConfig$optimi2; // only show warning for one build
            if ( isServer ) {
                console.warn( _chalk.default.yellow.bold( 'Warning: ' ) + _chalk.default.bold( 'Built-in CSS support is being disabled due to custom CSS configuration being detected.\n' ) + 'See here for more info: https://err.sh/next.js/built-in-css-disabled\n' );
            }
            if ( ( _webpackConfig$module2 = webpackConfig.module ) === null || _webpackConfig$module2 === void 0 ? void 0 : _webpackConfig$module2.rules.length ) { // Remove default CSS Loader
                webpackConfig.module.rules = webpackConfig.module.rules.filter( r => {
                    var _r$oneOf, _r$oneOf$;
                    return !( typeof ( ( _r$oneOf = r.oneOf ) === null || _r$oneOf === void 0 ? void 0 : ( _r$oneOf$ = _r$oneOf[0] ) === null || _r$oneOf$ === void 0 ? void 0 : _r$oneOf$.options ) === 'object' && r.oneOf[0].options.__next_css_remove === true );
                } );
            }
            if ( ( _webpackConfig$plugin = webpackConfig.plugins ) === null || _webpackConfig$plugin === void 0 ? void 0 : _webpackConfig$plugin.length ) { // Disable CSS Extraction Plugin
                webpackConfig.plugins = webpackConfig.plugins.filter( p => p.__next_css_remove !== true );
            }
            if ( ( _webpackConfig$optimi = webpackConfig.optimization ) === null || _webpackConfig$optimi === void 0 ? void 0 : ( _webpackConfig$optimi2 = _webpackConfig$optimi.minimizer ) === null || _webpackConfig$optimi2 === void 0 ? void 0 : _webpackConfig$optimi2.length ) { // Disable CSS Minifier
                webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter( e => e.__next_css_remove !== true );
            }
        }
        else {
            await ( 0, _overrideCssConfiguration.__overrideCssConfiguration )( dir, !dev, webpackConfig );
        }
    } // check if using @zeit/next-typescript and show warning
    if ( isServer && webpackConfig.module && Array.isArray( webpackConfig.module.rules ) ) {
        let foundTsRule = false;
        webpackConfig.module.rules = webpackConfig.module.rules.filter( rule => {
            if ( !( rule.test instanceof RegExp ) ) return true;
            if ( 'noop.ts'.match( rule.test ) && !'noop.js'.match( rule.test ) ) { // remove if it matches @zeit/next-typescript
                foundTsRule = rule.use === defaultLoaders.babel;
                return !foundTsRule;
            }
            return true;
        } );
        if ( foundTsRule ) {
            console.warn( '\n@zeit/next-typescript is no longer needed since Next.js has built-in support for TypeScript now. Please remove it from your next.config.js and your .babelrc\n' );
        }
    } // Patch `@zeit/next-sass`, `@zeit/next-less`, `@zeit/next-stylus` for compatibility
    if ( webpackConfig.module && Array.isArray( webpackConfig.module.rules ) ) {
        ;
        [].forEach.call( webpackConfig.module.rules, function ( rule ) {
            if ( !( rule.test instanceof RegExp && Array.isArray( rule.use ) ) ) {
                return;
            }
            const isSass = rule.test.source === '\\.scss$' || rule.test.source === '\\.sass$';
            const isLess = rule.test.source === '\\.less$';
            const isCss = rule.test.source === '\\.css$';
            const isStylus = rule.test.source === '\\.styl$'; // Check if the rule we're iterating over applies to Sass, Less, or CSS
            if ( !( isSass || isLess || isCss || isStylus ) ) {
                return;
            };
            [].forEach.call( rule.use, function ( use ) {
                if ( !( use && typeof use === 'object' && ( // Identify use statements only pertaining to `css-loader`
                    use.loader === 'css-loader' || use.loader === 'css-loader/locals' ) && use.options && typeof use.options === 'object' && ( // The `minimize` property is a good heuristic that we need to
                        // perform this hack. The `minimize` property was only valid on
                        // old `css-loader` versions. Custom setups (that aren't next-sass,
                        // next-less or next-stylus) likely have the newer version.
                        // We still handle this gracefully below.
                        Object.prototype.hasOwnProperty.call( use.options, 'minimize' ) || Object.prototype.hasOwnProperty.call( use.options, 'exportOnlyLocals' ) ) ) ) {
                    return;
                } // Try to monkey patch within a try-catch. We shouldn't fail the build
                // if we cannot pull this off.
                // The user may not even be using the `next-sass` or `next-less` or
                // `next-stylus` plugins.
                // If it does work, great!
                try { // Resolve the version of `@zeit/next-css` as depended on by the Sass,
                    // Less or Stylus plugin.
                    const correctNextCss = ( 0, _resolveRequest.resolveRequest )( '@zeit/next-css', isCss ? // Resolve `@zeit/next-css` from the base directory
                        `${dir}/` : // Else, resolve it from the specific plugins
                        require.resolve( isSass ? '@zeit/next-sass' : isLess ? '@zeit/next-less' : isStylus ? '@zeit/next-stylus' : 'next' ) ); // If we found `@zeit/next-css` ...
                    if ( correctNextCss ) { // ... resolve the version of `css-loader` shipped with that
                        // package instead of whichever was hoisted highest in your
                        // `node_modules` tree.
                        const correctCssLoader = ( 0, _resolveRequest.resolveRequest )( use.loader, correctNextCss );
                        if ( correctCssLoader ) { // We saved the user from a failed build!
                            use.loader = correctCssLoader;
                        }
                    }
                }
                catch ( _ ) { // The error is not required to be handled.
                }
            } );
        } );
    } // Backwards compat for `main.js` entry key
    const originalEntry = webpackConfig.entry;
    if ( typeof originalEntry !== 'undefined' ) {
        webpackConfig.entry = async () => {
            const entry = typeof originalEntry === 'function' ? await originalEntry() : originalEntry; // Server compilation doesn't have main.js
            if ( clientEntries && entry['main.js'] && entry['main.js'].length > 0 ) {
                const originalFile = clientEntries[_constants2.CLIENT_STATIC_FILES_RUNTIME_MAIN];
                entry[_constants2.CLIENT_STATIC_FILES_RUNTIME_MAIN] = [...entry['main.js'], originalFile];
            }
            delete entry['main.js'];
            return entry;
        };
    }
    if ( !dev ) { // entry is always a function
        webpackConfig.entry = await webpackConfig.entry();
    }

    return webpackConfig;
}