"use strict";
exports.__esModule = true;
exports.default = build;
var _chalk = _interopRequireDefault( require( "chalk" ) );
var _ciInfo = _interopRequireDefault( require( "ci-info" ) );
var _crypto = _interopRequireDefault( require( "crypto" ) );
var _devalue = _interopRequireDefault( require( "devalue" ) );
var _escapeStringRegexp = _interopRequireDefault( require( "escape-string-regexp" ) );
var _findUp = _interopRequireDefault( require( "find-up" ) );
var _fs = _interopRequireDefault( require( "fs" ) );
var _jestWorker = _interopRequireDefault( require( "jest-worker" ) );
var _mkdirp = _interopRequireDefault( require( "mkdirp" ) );
var _index = _interopRequireDefault( require( "next/dist/compiled/nanoid/index.js" ) );
var _path = _interopRequireDefault( require( "path" ) );
var _pathToRegexp = require( "path-to-regexp" );
var _util = require( "util" );
var _formatWebpackMessages = _interopRequireDefault( require( "../client/dev/error-overlay/format-webpack-messages" ) );
var _checkCustomRoutes = _interopRequireWildcard( require( "../lib/check-custom-routes" ) );




var _constants = require( "../lib/constants" );



var _findPagesDir = require( "../lib/find-pages-dir" );
var _recursiveDelete = require( "../lib/recursive-delete" );
var _recursiveReaddir = require( "../lib/recursive-readdir" );
var _verifyTypeScriptSetup = require( "../lib/verifyTypeScriptSetup" );
var _constants2 = require( "../next-server/lib/constants" );




var _utils = require( "../next-server/lib/router/utils" );




var _config = _interopRequireWildcard( require( "../next-server/server/config" ) );


var _normalizePagePath = require( "../next-server/server/normalize-page-path" );
var _events = require( "../telemetry/events" );




var _storage = require( "../telemetry/storage" );
var _compiler = require( "./compiler" );
var _entries = require( "./entries" );
var _generateBuildId = require( "./generate-build-id" );
var _isWriteable = require( "./is-writeable" );
var _spinner = _interopRequireDefault( require( "./spinner" ) );
var _utils2 = require( "./utils" );




var _webpackConfig = _interopRequireDefault( require( "./webpack-config" ) );
var _writeBuildId = require( "./write-build-id" );

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
            } else {
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
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _wrapRegExp( re, groups ) {
    _wrapRegExp = function ( re, groups ) {
        return new BabelRegExp( re, undefined, groups );
    };
    var _RegExp = _wrapNativeSuper( RegExp );
    var _super = RegExp.prototype;
    var _groups = new WeakMap();

    function BabelRegExp( re, flags, groups ) {
        var _this = _RegExp.call( this, re, flags );
        _groups.set( _this, groups || _groups.get( re ) );
        return _this;
    }
    _inherits( BabelRegExp, _RegExp );
    BabelRegExp.prototype.exec = function ( str ) {
        var result = _super.exec.call( this, str );
        if ( result ) result.groups = buildGroups( result, this );
        return result;
    };
    BabelRegExp.prototype[Symbol.replace] = function ( str, substitution ) {
        if ( typeof substitution === "string" ) {
            var groups = _groups.get( this );
            return _super[Symbol.replace].call( this, str, substitution.replace( /\$<([^>]+)>/g, function ( _, name ) {
                return "$" + groups[name];
            } ) );
        } else if ( typeof substitution === "function" ) {
            var _this = this;
            return _super[Symbol.replace].call( this, str, function () {
                var args = [];
                args.push.apply( args, arguments );
                if ( typeof args[args.length - 1] !== "object" ) {
                    args.push( buildGroups( args, _this ) );
                }
                return substitution.apply( this, args );
            } );
        } else {
            return _super[Symbol.replace].call( this, str, substitution );
        }
    };

    function buildGroups( result, re ) {
        var g = _groups.get( re );
        return Object.keys( g ).reduce( function ( groups, name ) {
            groups[name] = result[g[name]];
            return groups;
        }, Object.create( null ) );
    }
    return _wrapRegExp.apply( this, arguments );
}

function _inherits( subClass, superClass ) {
    if ( typeof superClass !== "function" && superClass !== null ) {
        throw new TypeError( "Super expression must either be null or a function" );
    }
    subClass.prototype = Object.create( superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    } );
    if ( superClass ) _setPrototypeOf( subClass, superClass );
}

function _possibleConstructorReturn( self, call ) {
    if ( call && ( typeof call === "object" || typeof call === "function" ) ) {
        return call;
    }
    return _assertThisInitialized( self );
}

function _assertThisInitialized( self ) {
    if ( self === void 0 ) {
        throw new ReferenceError( "this hasn't been initialised - super() hasn't been called" );
    }
    return self;
}

function _wrapNativeSuper( Class ) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper( Class ) {
        if ( Class === null || !_isNativeFunction( Class ) ) return Class;
        if ( typeof Class !== "function" ) {
            throw new TypeError( "Super expression must either be null or a function" );
        }
        if ( typeof _cache !== "undefined" ) {
            if ( _cache.has( Class ) ) return _cache.get( Class );
            _cache.set( Class, Wrapper );
        }

        function Wrapper() {
            return _construct( Class, arguments, _getPrototypeOf( this ).constructor );
        }
        Wrapper.prototype = Object.create( Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        } );
        return _setPrototypeOf( Wrapper, Class );
    };
    return _wrapNativeSuper( Class );
}

function isNativeReflectConstruct() {
    if ( typeof Reflect === "undefined" || !Reflect.construct ) return false;
    if ( Reflect.construct.sham ) return false;
    if ( typeof Proxy === "function" ) return true;
    try {
        Date.prototype.toString.call( Reflect.construct( Date, [], function () { } ) );
        return true;
    } catch ( e ) {
        return false;
    }
}

function _construct( Parent, args, Class ) {
    if ( isNativeReflectConstruct() ) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct( Parent, args, Class ) {
            var a = [null];
            a.push.apply( a, args );
            var Constructor = Function.bind.apply( Parent, a );
            var instance = new Constructor();
            if ( Class ) _setPrototypeOf( instance, Class.prototype );
            return instance;
        };
    }
    return _construct.apply( null, arguments );
}

function _isNativeFunction( fn ) {
    return Function.toString.call( fn ).indexOf( "[native code]" ) !== -1;
}

function _setPrototypeOf( o, p ) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf( o, p ) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf( o, p );
}

function _getPrototypeOf( o ) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf( o ) {
        return o.__proto__ || Object.getPrototypeOf( o );
    };
    return _getPrototypeOf( o );
}

const fsAccess = ( 0, _util.promisify )( _fs.default.access );
const fsUnlink = ( 0, _util.promisify )( _fs.default.unlink );
const fsRmdir = ( 0, _util.promisify )( _fs.default.rmdir );
const fsStat = ( 0, _util.promisify )( _fs.default.stat );
const fsMove = ( 0, _util.promisify )( _fs.default.rename );
const fsReadFile = ( 0, _util.promisify )( _fs.default.readFile );
const fsWriteFile = ( 0, _util.promisify )( _fs.default.writeFile );
const mkdirp = ( 0, _util.promisify )( _mkdirp.default );

const staticCheckWorker = require.resolve( './utils' );




async function build( dir, conf = null, destDir ) {
    if ( !( await ( 0, _isWriteable.isWriteable )( dir ) ) ) {
        throw new Error(
            '> Build directory is not writeable. https://err.sh/zeit/next.js/build-dir-not-writeable' );

    };

    const config = ( 0, _config.default )( _constants2.PHASE_PRODUCTION_BUILD, dir, conf );
    const {
        target
    } = config;
    const buildId = await ( 0, _generateBuildId.generateBuildId )( config.generateBuildId, _index.default );
    const distDir = _path.default.join( destDir, config.distDir );
    const headers = [];
    const rewrites = [];
    const redirects = [];

    if ( typeof config.experimental.redirects === 'function' ) {
        const _redirects = await config.experimental.redirects();
        ( 0, _checkCustomRoutes.default )( _redirects, 'redirect' );
        redirects.push( ..._redirects );
    }
    if ( typeof config.experimental.rewrites === 'function' ) {
        const _rewrites = await config.experimental.rewrites();
        ( 0, _checkCustomRoutes.default )( _rewrites, 'rewrite' );
        rewrites.push( ..._rewrites );
    }
    if ( typeof config.experimental.headers === 'function' ) {
        const _headers = await config.experimental.headers();
        ( 0, _checkCustomRoutes.default )( _headers, 'header' );
        headers.push( ..._headers );
    }

    if ( _ciInfo.default.isCI ) {
        const cacheDir = _path.default.join( distDir, 'cache' );
        const hasCache = await fsAccess( cacheDir ).
            then( () => true ).
            catch( () => false );

        if ( !hasCache ) {
            // Intentionally not piping to stderr in case people fail in CI when
            // stderr is detected.
            console.log(
                _chalk.default.bold.yellow( `Warning: ` ) +
                _chalk.default.bold(
                    `No build cache found. Please configure build caching for faster rebuilds. Read more: https://err.sh/next.js/no-cache` ) );


            console.log( '' );
        }
    }

    const buildSpinner = ( 0, _spinner.default )( {
        prefixText: 'Creating an optimized production build'
    } );


    const telemetry = new _storage.Telemetry( {
        distDir
    } );

    const publicDir = _path.default.join( dir, 'public' );
    const pagesDir = ( 0, _findPagesDir.findPagesDir )( dir );
    let publicFiles = [];
    let hasPublicDir = false;

    telemetry.record(
        ( 0, _events.eventCliSession )( _constants2.PHASE_PRODUCTION_BUILD, dir, {
            cliCommand: 'build',
            isSrcDir: _path.default.relative( dir, pagesDir ).startsWith( 'src' ),
            hasNowJson: !!( await ( 0, _findUp.default )( 'now.json', {
                cwd: dir
            } ) ),
            isCustomServer: null
        } ) );



    ( 0, _events.eventNextPlugins )( _path.default.resolve( dir ) ).then( events => telemetry.record( events ) );

    await ( 0, _verifyTypeScriptSetup.verifyTypeScriptSetup )( dir, pagesDir );

    try {
        await fsStat( publicDir );
        hasPublicDir = true;
    } catch ( _ ) { }

    if ( hasPublicDir ) {
        publicFiles = await ( 0, _recursiveReaddir.recursiveReadDir )( publicDir, /.*/ );
    }

    let tracer = null;
    if ( config.experimental.profiling ) {
        const {
            createTrace
        } = require( './profiler/profiler.js' );
        tracer = createTrace( _path.default.join( distDir, `profile-events.json` ) );
        tracer.profiler.startProfiling();
    }

    const isLikeServerless = ( 0, _config.isTargetLikeServerless )( target );

    const pagePaths = await ( 0, _utils2.collectPages )(
        pagesDir,
        config.pageExtensionsRnv || config.pageExtensions );


    // needed for static exporting since we want to replace with HTML
    // files
    const allStaticPages = new Set();
    let allPageInfos = new Map();

    const previewProps = {
        previewModeId: _crypto.default.randomBytes( 16 ).toString( 'hex' ),
        previewModeSigningKey: _crypto.default.randomBytes( 32 ).toString( 'hex' ),
        previewModeEncryptionKey: _crypto.default.randomBytes( 32 ).toString( 'hex' )
    };


    const mappedPages = ( 0, _entries.createPagesMapping )( pagePaths, config.pageExtensions );
    const entrypoints = ( 0, _entries.createEntrypoints )(
        mappedPages,
        target,
        buildId,
        previewProps,
        config );
    const pageKeys = Object.keys( mappedPages );
    const dynamicRoutes = pageKeys.filter( page => ( 0, _utils.isDynamicRoute )( page ) );
    const conflictingPublicFiles = [];
    const hasCustomErrorPage = mappedPages['/_error'].startsWith(
        'private-next-pages' );

    const hasPages404 = Boolean(
        mappedPages['/404'] && mappedPages['/404'].startsWith( 'private-next-pages' ) );

    let hasNonStaticErrorPage;

    if ( hasPublicDir ) {
        try {
            await fsStat( _path.default.join( publicDir, '_next' ) );
            throw new Error( _constants.PUBLIC_DIR_MIDDLEWARE_CONFLICT );
        } catch ( err ) { }
    }

    for ( let file of publicFiles ) {
        file = file.
            replace( /\\/g, '/' ).
            replace( /\/index$/, '' ).
            split( publicDir ).
            pop();

        if ( mappedPages[file] ) {
            conflictingPublicFiles.push( file );
        }
    }
    const numConflicting = conflictingPublicFiles.length;

    if ( numConflicting ) {
        throw new Error(
            `Conflicting public and page file${
            numConflicting === 1 ? ' was' : 's were'
            } found. https://err.sh/zeit/next.js/conflicting-public-file-page\n${conflictingPublicFiles.join(
                '\n' )
            }` );

    }

    const buildCustomRoute = (
        r,



        type ) => {
        const keys = [];
        const routeRegex = ( 0, _pathToRegexp.pathToRegexp )( r.source, keys, {
            strict: true,
            sensitive: false,
            delimiter: '/' // default is `/#?`, but Next does not pass query info
        } );

        return {
            ...r,
            ...( type === 'redirect' ? {
                statusCode: ( 0, _checkCustomRoutes.getRedirectStatus )( r ),
                permanent: undefined
            } :

                {} ),
            regex: routeRegex.source
        };

    };

    const routesManifestPath = _path.default.join( distDir, _constants2.ROUTES_MANIFEST );
    const routesManifest = {
        version: 1,
        pages404: true,
        basePath: config.experimental.basePath,
        redirects: redirects.map( r => buildCustomRoute( r, 'redirect' ) ),
        rewrites: rewrites.map( r => buildCustomRoute( r, 'rewrite' ) ),
        headers: headers.map( r => buildCustomRoute( r, 'header' ) ),
        dynamicRoutes: ( 0, _utils.getSortedRoutes )( dynamicRoutes ).map( page => ( {
            page,
            regex: ( 0, _utils.getRouteRegex )( page ).re.source
        } ) )
    };



    await mkdirp( distDir );
    // We need to write the manifest with rewrites before build
    // so serverless can import the manifest
    await fsWriteFile( routesManifestPath, JSON.stringify( routesManifest ), 'utf8' );

    const configs = await Promise.all( [
        ( 0, _webpackConfig.default )( destDir || dir, {
            tracer,
            buildId,
            isServer: false,
            config,
            target,
            pagesDir,
            entrypoints: entrypoints.client
        } ),

        ( 0, _webpackConfig.default )( destDir || dir, {
            tracer,
            buildId,
            isServer: true,
            config,
            target,
            pagesDir,
            entrypoints: entrypoints.server
        } )
    ] );



    const clientConfig = configs[0];

    if (
        clientConfig.optimization && (
            clientConfig.optimization.minimize !== true ||
            clientConfig.optimization.minimizer &&
            clientConfig.optimization.minimizer.length === 0 ) ) {
        console.warn(
            _chalk.default.bold.yellow( `Warning: ` ) +
            _chalk.default.bold(
                `Production code optimization has been disabled in your project. Read more: https://err.sh/zeit/next.js/minification-disabled` ) );


    }

    const webpackBuildStart = process.hrtime();

    let result = {
        warnings: [],
        errors: []
    };
    // TODO: why do we need this?? https://github.com/zeit/next.js/issues/8253
    if ( isLikeServerless ) {
        const clientResult = await ( 0, _compiler.runCompiler )( clientConfig );
        // Fail build if clientResult contains errors
        if ( clientResult.errors.length > 0 ) {
            result = {
                warnings: [...clientResult.warnings],
                errors: [...clientResult.errors]
            };

        } else {
            const serverResult = await ( 0, _compiler.runCompiler )( configs[1] );
            result = {
                warnings: [...clientResult.warnings, ...serverResult.warnings],
                errors: [...clientResult.errors, ...serverResult.errors]
            };

        }
    } else {
        result = await ( 0, _compiler.runCompiler )( configs );
    }

    const webpackBuildEnd = process.hrtime( webpackBuildStart );
    if ( buildSpinner ) {
        buildSpinner.stopAndPersist();
    }
    console.log();

    result = ( 0, _formatWebpackMessages.default )( result );

    if ( result.errors.length > 0 ) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if ( result.errors.length > 1 ) {
            result.errors.length = 1;
        }
        const error = result.errors.join( '\n\n' );

        console.error( _chalk.default.red( 'Failed to compile.\n' ) );

        if (
            error.indexOf( 'private-next-pages' ) > -1 &&
            error.indexOf( 'does not contain a default export' ) > -1 ) {
            const page_name_regex = _wrapRegExp( /'private\x2Dnext\x2Dpages\/([\0-&\(-\uFFFF]*)'/, {
                page_name: 1
            } );
            const parsed = page_name_regex.exec( error );
            const page_name = parsed && parsed.groups && parsed.groups.page_name;
            throw new Error(
                `webpack build failed: found page without a React Component as default export in pages/${page_name}\n\nSee https://err.sh/zeit/next.js/page-without-valid-component for more info.` );

        }

        console.error( error );
        console.error();

        if (
            error.indexOf( 'private-next-pages' ) > -1 ||
            error.indexOf( '__next_polyfill__' ) > -1 ) {
            throw new Error(
                '> webpack config.resolve.alias was incorrectly overriden. https://err.sh/zeit/next.js/invalid-resolve-alias' );

        }
        throw new Error( '> Build failed because of webpack errors' );
    } else {
        telemetry.record(
            ( 0, _events.eventBuildCompleted )( pagePaths, {
                durationInSeconds: webpackBuildEnd[0]
            } ) );



        if ( result.warnings.length > 0 ) {
            console.warn( _chalk.default.yellow( 'Compiled with warnings.\n' ) );
            console.warn( result.warnings.join( '\n\n' ) );
            console.warn();
        } else {
            console.log( _chalk.default.green( 'Compiled successfully.\n' ) );
        }
    }
    const postBuildSpinner = ( 0, _spinner.default )( {
        prefixText: 'Automatically optimizing pages'
    } );


    const manifestPath = _path.default.join(
        distDir,
        isLikeServerless ? _constants2.SERVERLESS_DIRECTORY : _constants2.SERVER_DIRECTORY,
        _constants2.PAGES_MANIFEST );

    const buildManifestPath = _path.default.join( distDir, _constants2.BUILD_MANIFEST );

    const ssgPages = new Set();
    const ssgFallbackPages = new Set();
    const staticPages = new Set();
    const invalidPages = new Set();
    const hybridAmpPages = new Set();
    const serverPropsPages = new Set();
    const additionalSsgPaths = new Map();
    const pageInfos = new Map();
    const pagesManifest = JSON.parse( ( await fsReadFile( manifestPath, 'utf8' ) ) );
    const buildManifest = JSON.parse( ( await fsReadFile( buildManifestPath, 'utf8' ) ) );

    let customAppGetInitialProps;

    process.env.NEXT_PHASE = _constants2.PHASE_PRODUCTION_BUILD;

    const staticCheckWorkers = new _jestWorker.default( staticCheckWorker, {
        numWorkers: config.experimental.cpus,
        enableWorkerThreads: config.experimental.workerThreads
    } );


    staticCheckWorkers.getStdout().pipe( process.stdout );
    staticCheckWorkers.getStderr().pipe( process.stderr );

    const runtimeEnvConfig = {
        publicRuntimeConfig: config.publicRuntimeConfig,
        serverRuntimeConfig: config.serverRuntimeConfig
    };


    hasNonStaticErrorPage =
        hasCustomErrorPage && (
            await ( 0, _utils2.hasCustomGetInitialProps )(
                _path.default.join(
                    distDir,
                    ...( isLikeServerless ? ['serverless', 'pages'] : ['server', 'static', buildId, 'pages'] ),
                    '_error.js' ),

                runtimeEnvConfig ) );


    const analysisBegin = process.hrtime();
    await Promise.all(
        pageKeys.map( async page => {
            const actualPage = ( 0, _normalizePagePath.normalizePagePath )( page );
            const [selfSize, allSize] = await ( 0, _utils2.getPageSizeInKb )(
                actualPage,
                distDir,
                buildId,
                buildManifest,
                config.experimental.modern );

            const bundleRelative = _path.default.join(
                isLikeServerless ? 'pages' : `static/${buildId}/pages`,
                actualPage + '.js' );

            const serverBundle = _path.default.join(
                distDir,
                isLikeServerless ? _constants2.SERVERLESS_DIRECTORY : _constants2.SERVER_DIRECTORY,
                bundleRelative );


            let isSsg = false;
            let isStatic = false;
            let isHybridAmp = false;
            let ssgPageRoutes = null;
            let hasSsgFallback = false;

            pagesManifest[page] = bundleRelative.replace( /\\/g, '/' );

            const nonReservedPage = !page.match( /^\/(_app|_error|_document|api)/ );

            if ( nonReservedPage && customAppGetInitialProps === undefined ) {
                customAppGetInitialProps = ( 0, _utils2.hasCustomGetInitialProps )(
                    isLikeServerless ?
                        serverBundle :
                        _path.default.join(
                            distDir,
                            _constants2.SERVER_DIRECTORY,
                            `/static/${buildId}/pages/_app.js` ),

                    runtimeEnvConfig );


                if ( customAppGetInitialProps ) {
                    console.warn(
                        _chalk.default.bold.yellow( `Warning: ` ) +
                        _chalk.default.yellow(
                            `You have opted-out of Automatic Static Optimization due to \`getInitialProps\` in \`pages/_app\`.` ) );


                    console.warn(
                        'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n' );

                }
            }

            if ( nonReservedPage ) {
                try {
                    let result = await staticCheckWorkers.isPageStatic(
                        page,
                        serverBundle,
                        runtimeEnvConfig );


                    if ( result.isHybridAmp ) {
                        isHybridAmp = true;
                        hybridAmpPages.add( page );
                    }

                    if ( result.hasStaticProps ) {
                        ssgPages.add( page );
                        isSsg = true;

                        if ( result.prerenderRoutes ) {
                            additionalSsgPaths.set( page, result.prerenderRoutes );
                            ssgPageRoutes = result.prerenderRoutes;
                        }
                        if ( result.prerenderFallback ) {
                            hasSsgFallback = true;
                            ssgFallbackPages.add( page );
                        }
                    } else if ( result.hasServerProps ) {
                        serverPropsPages.add( page );
                    } else if ( result.isStatic && customAppGetInitialProps === false ) {
                        staticPages.add( page );
                        isStatic = true;
                    }

                    if ( hasPages404 && page === '/404' ) {
                        if ( !result.isStatic && !result.hasStaticProps ) {
                            throw new Error( _constants.PAGES_404_GET_INITIAL_PROPS_ERROR );
                        }
                        // we need to ensure the 404 lambda is present since we use
                        // it when _app has getInitialProps
                        if ( customAppGetInitialProps && !result.hasStaticProps ) {
                            staticPages.delete( page );
                        }
                    }
                } catch ( err ) {
                    if ( err.message !== 'INVALID_DEFAULT_EXPORT' ) throw err;
                    invalidPages.add( page );
                }
            }

            pageInfos.set( page, {
                size: selfSize,
                totalSize: allSize,
                serverBundle,
                static: isStatic,
                isSsg,
                isHybridAmp,
                ssgPageRoutes,
                hasSsgFallback
            } );

        } ) );

    staticCheckWorkers.end();

    if ( serverPropsPages.size > 0 || ssgPages.size > 0 ) {
        // We update the routes manifest after the build with the
        // data routes since we can't determine these until after build
        routesManifest.dataRoutes = ( 0, _utils.getSortedRoutes )( [
            ...serverPropsPages,
            ...ssgPages
        ] ).
            map( page => {
                const pagePath = ( 0, _normalizePagePath.normalizePagePath )( page );
                const dataRoute = _path.default.posix.join(
                    '/_next/data',
                    buildId,
                    `${pagePath}.json` );


                return {
                    page,
                    dataRouteRegex: ( 0, _utils.isDynamicRoute )( page ) ?
                        ( 0, _utils.getRouteRegex )( dataRoute.replace( /\.json$/, '' ) ).re.source.replace(
                            /\(\?:\\\/\)\?\$$/,
                            '\\.json$' ) :

                        new RegExp(
                            `^${_path.default.posix.join(
                                '/_next/data',
                                ( 0, _escapeStringRegexp.default )( buildId ),
                                `${pagePath}.json` )
                            }$` ).
                            source
                };

            } );

        await fsWriteFile(
            routesManifestPath,
            JSON.stringify( routesManifest ),
            'utf8' );

    }
    // Since custom _app.js can wrap the 404 page we have to opt-out of static optimization if it has getInitialProps
    // Only export the static 404 when there is no /_error present
    const useStatic404 = !customAppGetInitialProps && ( !hasNonStaticErrorPage || hasPages404 );

    if ( invalidPages.size > 0 ) {
        throw new Error(
            `Build optimization failed: found page${
            invalidPages.size === 1 ? '' : 's'
            } without a React Component as default export in \n${[...invalidPages].
                map( pg => `pages${pg}` ).
                join(
                    '\n' )
            }\n\nSee https://err.sh/zeit/next.js/page-without-valid-component for more info.\n` );

    }

    if ( Array.isArray( configs[0].plugins ) ) {
        configs[0].plugins.some( plugin => {
            if ( !plugin.ampPages ) {
                return false;
            }

            plugin.ampPages.forEach( pg => {
                pageInfos.get( pg ).isAmp = true;
            } );
            return true;
        } );
    }

    await ( 0, _writeBuildId.writeBuildId )( distDir, buildId );

    const finalPrerenderRoutes = {};
    const tbdPrerenderRoutes = [];

    if ( staticPages.size > 0 || ssgPages.size > 0 || useStatic404 ) {
        const combinedPages = [...staticPages, ...ssgPages];
        const exportApp = require( '../export' ).default;
        const exportOptions = {
            silent: true,
            buildExport: true,
            threads: config.experimental.cpus,
            pages: combinedPages,
            outdir: _path.default.join( distDir, 'export' )
        };

        const exportConfig = {
            ...config,
            initialPageRevalidationMap: {},
            // Default map will be the collection of automatic statically exported
            // pages and SPR pages.
            // n.b. we cannot handle this above in combinedPages because the dynamic
            // page must be in the `pages` array, but not in the mapping.
            exportPathMap: defaultMap => {
                // Dynamically routed pages should be prerendered to be used as
                // a client-side skeleton (fallback) while data is being fetched.
                // This ensures the end-user never sees a 500 or slow response from the
                // server.
                //
                // Note: prerendering disables automatic static optimization.
                ssgPages.forEach( page => {
                    if ( ( 0, _utils.isDynamicRoute )( page ) ) {
                        tbdPrerenderRoutes.push( page );

                        if ( ssgFallbackPages.has( page ) ) {
                            // Override the rendering for the dynamic page to be treated as a
                            // fallback render.
                            defaultMap[page] = {
                                page,
                                query: {
                                    __nextFallback: true
                                }
                            };
                        } else {
                            // Remove dynamically routed pages from the default path map when
                            // fallback behavior is disabled.
                            delete defaultMap[page];
                        }
                    }
                } );
                // Append the "well-known" routes we should prerender for, e.g. blog
                // post slugs.
                additionalSsgPaths.forEach( ( routes, page ) => {
                    routes.forEach( route => {
                        defaultMap[route] = {
                            page
                        };
                    } );
                } );

                if ( useStatic404 ) {
                    defaultMap['/404'] = {
                        page: hasPages404 ? '/404' : '/_error'
                    };

                }

                return defaultMap;
            },
            exportTrailingSlash: false
        };


        await exportApp( destDir || dir, exportOptions, exportConfig );

        // remove server bundles that were exported
        for ( const page of staticPages ) {
            const {
                serverBundle
            } = pageInfos.get( page );
            await fsUnlink( serverBundle );
        }

        const moveExportedPage = async (
            page,
            file,
            isSsg,
            ext ) => {
            file = `${file}.${ext}`;
            const orig = _path.default.join( exportOptions.outdir, file );
            const relativeDest = ( isLikeServerless ?
                _path.default.join( 'pages', file ) :
                _path.default.join( 'static', buildId, 'pages', file ) ).
                replace( /\\/g, '/' );

            const dest = _path.default.join(
                distDir,
                isLikeServerless ? _constants2.SERVERLESS_DIRECTORY : _constants2.SERVER_DIRECTORY,
                relativeDest );


            if ( !isSsg ) {
                pagesManifest[page] = relativeDest;
                if ( page === '/' ) pagesManifest['/index'] = relativeDest;
                if ( page === '/.amp' ) pagesManifest['/index.amp'] = relativeDest;
            }
            await mkdirp( _path.default.dirname( dest ) );
            await fsMove( orig, dest );
        };

        // Only move /404 to /404 when there is no custom 404 as in that case we don't know about the 404 page
        if ( !hasPages404 && useStatic404 ) {
            await moveExportedPage( '/404', '/404', false, 'html' );
        }

        for ( const page of combinedPages ) {
            const isSsg = ssgPages.has( page );
            const isSsgFallback = ssgFallbackPages.has( page );
            const isDynamic = ( 0, _utils.isDynamicRoute )( page );
            const hasAmp = hybridAmpPages.has( page );
            let file = ( 0, _normalizePagePath.normalizePagePath )( page );

            // The dynamic version of SSG pages are only prerendered if the fallback
            // is enabled. Below, we handle the specific prerenders of these.
            if ( !( isSsg && isDynamic && !isSsgFallback ) ) {
                await moveExportedPage( page, file, isSsg, 'html' );
            }

            if ( hasAmp ) {
                await moveExportedPage( `${page}.amp`, `${file}.amp`, isSsg, 'html' );
            }

            if ( isSsg ) {
                // For a non-dynamic SSG page, we must copy its data file from export.
                if ( !isDynamic ) {
                    await moveExportedPage( page, file, true, 'json' );

                    finalPrerenderRoutes[page] = {
                        initialRevalidateSeconds: exportConfig.initialPageRevalidationMap[page],
                        srcRoute: null,
                        dataRoute: _path.default.posix.join( '/_next/data', buildId, `${file}.json` )
                    };

                } else {
                    // For a dynamic SSG page, we did not copy its data exports and only
                    // copy the fallback HTML file (if present).
                    // We must also copy specific versions of this page as defined by
                    // `getStaticPaths` (additionalSsgPaths).
                    const extraRoutes = additionalSsgPaths.get( page ) || [];
                    for ( const route of extraRoutes ) {
                        await moveExportedPage( route, route, true, 'html' );
                        await moveExportedPage( route, route, true, 'json' );
                        finalPrerenderRoutes[route] = {
                            initialRevalidateSeconds: exportConfig.initialPageRevalidationMap[route],
                            srcRoute: page,
                            dataRoute: _path.default.posix.join(
                                '/_next/data',
                                buildId,
                                `${( 0, _normalizePagePath.normalizePagePath )( route )}.json` )
                        };


                    }
                }
            }
        }

        // remove temporary export folder
        await ( 0, _recursiveDelete.recursiveDelete )( exportOptions.outdir );
        await fsRmdir( exportOptions.outdir );
        await fsWriteFile( manifestPath, JSON.stringify( pagesManifest ), 'utf8' );
    }

    if ( postBuildSpinner ) postBuildSpinner.stopAndPersist();
    console.log();

    const analysisEnd = process.hrtime( analysisBegin );
    telemetry.record(
        ( 0, _events.eventBuildOptimize )( pagePaths, {
            durationInSeconds: analysisEnd[0],
            staticPageCount: staticPages.size,
            staticPropsPageCount: ssgPages.size,
            serverPropsPageCount: serverPropsPages.size,
            ssrPageCount: pagePaths.length - (
                staticPages.size + ssgPages.size + serverPropsPages.size ),
            hasStatic404: useStatic404
        } ) );



    if ( ssgPages.size > 0 ) {
        const finalDynamicRoutes = {};
        tbdPrerenderRoutes.forEach( tbdRoute => {
            const normalizedRoute = ( 0, _normalizePagePath.normalizePagePath )( tbdRoute );
            const dataRoute = _path.default.posix.join(
                '/_next/data',
                buildId,
                `${normalizedRoute}.json` );


            finalDynamicRoutes[tbdRoute] = {
                routeRegex: ( 0, _utils.getRouteRegex )( tbdRoute ).re.source,
                dataRoute,
                fallback: ssgFallbackPages.has( tbdRoute ) ?
                    `${normalizedRoute}.html` : false,
                dataRouteRegex: ( 0, _utils.getRouteRegex )(
                    dataRoute.replace( /\.json$/, '' ) ).
                    re.source.replace( /\(\?:\\\/\)\?\$$/, '\\.json$' )
            };

        } );
        const prerenderManifest = {
            version: 2,
            routes: finalPrerenderRoutes,
            dynamicRoutes: finalDynamicRoutes,
            preview: previewProps
        };


        await fsWriteFile(
            _path.default.join( distDir, _constants2.PRERENDER_MANIFEST ),
            JSON.stringify( prerenderManifest ),
            'utf8' );

        await generateClientSsgManifest( prerenderManifest, {
            distDir,
            buildId,
            isModern: !!config.experimental.modern
        } );

    } else {
        const prerenderManifest = {
            version: 2,
            routes: {},
            dynamicRoutes: {},
            preview: previewProps
        };

        await fsWriteFile(
            _path.default.join( distDir, _constants2.PRERENDER_MANIFEST ),
            JSON.stringify( prerenderManifest ),
            'utf8' );

        // No need to call this fn as we already emitted a default SSG manifest:
        // await generateClientSsgManifest(prerenderManifest, { distDir, buildId })
    }

    await fsWriteFile(
        _path.default.join( distDir, _constants2.EXPORT_MARKER ),
        JSON.stringify( {
            version: 1,
            hasExportPathMap: typeof config.exportPathMap === 'function',
            exportTrailingSlash: config.exportTrailingSlash === true
        } ),

        'utf8' );

    await fsUnlink( _path.default.join( distDir, _constants2.EXPORT_DETAIL ) ).catch( err => {
        if ( err.code === 'ENOENT' ) {
            return Promise.resolve();
        }
        return Promise.reject( err );
    } );

    staticPages.forEach( pg => allStaticPages.add( pg ) );
    pageInfos.forEach( ( info, key ) => {
        allPageInfos.set( key, info );
    } );

    await ( 0, _utils2.printTreeView )(
        Object.keys( mappedPages ),
        allPageInfos,
        isLikeServerless, {
        distPath: distDir,
        buildId: buildId,
        pagesDir,
        useStatic404,
        pageExtensions: config.pageExtensions,
        buildManifest,
        isModern: config.experimental.modern
    } );


    ( 0, _utils2.printCustomRoutes )( {
        redirects,
        rewrites,
        headers
    } );

    if ( tracer ) {
        const parsedResults = await tracer.profiler.stopProfiling();
        await new Promise( resolve => {
            if ( parsedResults === undefined ) {
                tracer.profiler.destroy();
                tracer.trace.flush();
                tracer.end( resolve );
                return;
            }

            const cpuStartTime = parsedResults.profile.startTime;
            const cpuEndTime = parsedResults.profile.endTime;

            tracer.trace.completeEvent( {
                name: 'TaskQueueManager::ProcessTaskFromWorkQueue',
                id: ++tracer.counter,
                cat: ['toplevel'],
                ts: cpuStartTime,
                args: {
                    src_file: '../../ipc/ipc_moji_bootstrap.cc',
                    src_func: 'Accept'
                }
            } );



            tracer.trace.completeEvent( {
                name: 'EvaluateScript',
                id: ++tracer.counter,
                cat: ['devtools.timeline'],
                ts: cpuStartTime,
                dur: cpuEndTime - cpuStartTime,
                args: {
                    data: {
                        url: 'webpack',
                        lineNumber: 1,
                        columnNumber: 1,
                        frame: '0xFFF'
                    }
                }
            } );




            tracer.trace.instantEvent( {
                name: 'CpuProfile',
                id: ++tracer.counter,
                cat: ['disabled-by-default-devtools.timeline'],
                ts: cpuEndTime,
                args: {
                    data: {
                        cpuProfile: parsedResults.profile
                    }
                }
            } );




            tracer.profiler.destroy();
            tracer.trace.flush();
            tracer.end( resolve );
        } );
    }

    await telemetry.flush();
}

function generateClientSsgManifest(
    prerenderManifest, {
        buildId,
        distDir,
        isModern
    } ) {
    const ssgPages = new Set( [
        ...Object.entries( prerenderManifest.routes )
            // Filter out dynamic routes
            .filter( ( [, {
                srcRoute
            }] ) => srcRoute == null ).
            map( ( [route] ) => route ),
        ...Object.keys( prerenderManifest.dynamicRoutes )
    ] );


    const clientSsgManifestPaths = [
        '_ssgManifest.js',
        isModern && '_ssgManifest.module.js'
    ].

        filter( Boolean ).
        map( f => _path.default.join( `${_constants2.CLIENT_STATIC_FILES_PATH}/${buildId}`, f ) );
    const clientSsgManifestContent = `self.__SSG_MANIFEST=${( 0, _devalue.default )(
        ssgPages )
        };self.__SSG_MANIFEST_CB&&self.__SSG_MANIFEST_CB()`;
    clientSsgManifestPaths.forEach( ( clientSsgManifestPath ) =>
        _fs.default.writeFileSync(
            _path.default.join( distDir, clientSsgManifestPath ),
            clientSsgManifestContent ) );


}