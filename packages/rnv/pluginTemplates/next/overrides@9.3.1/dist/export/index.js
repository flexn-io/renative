"use strict";
exports.__esModule = true;
exports.default = _default;
var _chalk = _interopRequireDefault( require( "chalk" ) );
var _findUp = _interopRequireDefault( require( "find-up" ) );
var _fs = require( "fs" );





var _jestWorker = _interopRequireDefault( require( "jest-worker" ) );
var _mkdirp = _interopRequireDefault( require( "mkdirp" ) );
var _os = require( "os" );
var _path = require( "path" );
var _util = require( "util" );
var _index = require( "../build/output/index" );
var _spinner = _interopRequireDefault( require( "../build/spinner" ) );
var _constants = require( "../lib/constants" );
var _recursiveCopy = require( "../lib/recursive-copy" );
var _recursiveDelete = require( "../lib/recursive-delete" );
var _constants2 = require( "../next-server/lib/constants" );











var _config = _interopRequireWildcard( require( "../next-server/server/config" ) );


var _events = require( "../telemetry/events" );
var _storage = require( "../telemetry/storage" );
var _normalizePagePath = require( "../next-server/server/normalize-page-path" );

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

const mkdirp = ( 0, _util.promisify )( _mkdirp.default );
const copyFile = ( 0, _util.promisify )( _fs.copyFile );

const createProgress = ( total, label = 'Exporting' ) => {
    let curProgress = 0;
    let progressSpinner = ( 0, _spinner.default )( `${label} (${curProgress}/${total})`,
        {
            spinner:
            {
                frames: [
                    '[    ]',
                    '[=   ]',
                    '[==  ]',
                    '[=== ]',
                    '[ ===]',
                    '[  ==]',
                    '[   =]',
                    '[    ]',
                    '[   =]',
                    '[  ==]',
                    '[ ===]',
                    '[====]',
                    '[=== ]',
                    '[==  ]',
                    '[=   ]'
                ],

                interval: 80
            }
        } );



    return () => {
        curProgress++;

        const newText = `${label} (${curProgress}/${total})`;
        if ( progressSpinner ) {
            progressSpinner.text = newText;
        }
        else {
            console.log( newText );
        }

        if ( curProgress === total && progressSpinner ) {
            progressSpinner.stop();
            console.log( newText );
        }
    };
};

async function _default(
    dir,
    options,
    configuration, 
    destDir ) {
    var _nextConfig$amp, _nextConfig$experimen;

    function log( message ) {
        if ( options.silent ) {
            return;
        }
        console.log( message );
    }

    dir = ( 0, _path.resolve )( dir );
    const nextConfig = configuration || ( 0, _config.default )( _constants2.PHASE_EXPORT, dir );
    const threads = options.threads || Math.max( ( 0, _os.cpus )().length - 1, 1 );
    const distDir = ( 0, _path.join )( destDir || dir, nextConfig.distDir );

    const telemetry = options.buildExport ? null : new _storage.Telemetry(
        {
            distDir
        } );

    if ( telemetry ) {
        telemetry.record(
            ( 0, _events.eventCliSession )( _constants2.PHASE_EXPORT, distDir,
                {
                    cliCommand: 'export',
                    isSrcDir: null,
                    hasNowJson: !!( await ( 0, _findUp.default )( 'now.json',
                        {
                            cwd: dir
                        } ) ),
                    isCustomServer: null
                } ) );


    }

    const subFolders = nextConfig.exportTrailingSlash;
    const isLikeServerless = nextConfig.target !== 'server';

    log( `> using build directory: ${distDir}` );

    if ( !( 0, _fs.existsSync )( distDir ) ) {
        throw new Error(
            `Build directory ${distDir} does not exist. Make sure you run "next build" before running "next start" or "next export".` );

    }

    const buildId = ( 0, _fs.readFileSync )( ( 0, _path.join )( distDir, _constants2.BUILD_ID_FILE ), 'utf8' );
    const pagesManifest = !options.pages &&
        require( ( 0, _path.join )(
            distDir,
            isLikeServerless ? _constants2.SERVERLESS_DIRECTORY : _constants2.SERVER_DIRECTORY,
            _constants2.PAGES_MANIFEST ) );


    let prerenderManifest;
    try {
        prerenderManifest = require( ( 0, _path.join )( distDir, _constants2.PRERENDER_MANIFEST ) );
    }
    catch ( _ ) { }

    const distPagesDir = ( 0, _path.join )(
        distDir,
        isLikeServerless ?
            _constants2.SERVERLESS_DIRECTORY :
            ( 0, _path.join )( _constants2.SERVER_DIRECTORY, 'static', buildId ),
        'pages' );


    const pages = options.pages || Object.keys( pagesManifest );
    const defaultPathMap = {};

    for ( const page of pages ) {
        var _prerenderManifest;
        // _document and _app are not real pages
        // _error is exported as 404.html later on
        // API Routes are Node.js functions
        if (
            page === '/_document' ||
            page === '/_app' ||
            page === '/_error' ||
            page.match( _constants.API_ROUTE ) ) {
            continue;
        }

        // iSSG pages that are dynamic should not export templated version by
        // default. In most cases, this would never work. There is no server that
        // could run `getStaticProps`. If users make their page work lazily, they
        // can manually add it to the `exportPathMap`.
        if ( ( _prerenderManifest = prerenderManifest ) === null || _prerenderManifest === void 0 ? void 0 : _prerenderManifest.dynamicRoutes[page] ) {
            continue;
        }

        defaultPathMap[page] = {
            page
        };
    }

    // Initialize the output directory
    // const outDir = options.outdir;
    const outDir = destDir ? _path.join(destDir, 'out') : options.outdir;

    if ( outDir === ( 0, _path.join )( dir, 'public' ) ) {
        throw new Error(
            `The 'public' directory is reserved in Next.js and can not be used as the export out directory. https://err.sh/zeit/next.js/can-not-output-to-public` );

    }

    await ( 0, _recursiveDelete.recursiveDelete )( ( 0, _path.join )( outDir ) );
    await mkdirp( ( 0, _path.join )( outDir, '_next', buildId ) );

    ( 0, _fs.writeFileSync )(
        ( 0, _path.join )( distDir, _constants2.EXPORT_DETAIL ),
        JSON.stringify(
            {
                version: 1,
                outDirectory: outDir,
                success: false
            } ),

        'utf8' );


    // Copy static directory
    if ( !options.buildExport && ( 0, _fs.existsSync )( ( 0, _path.join )( dir, 'static' ) ) ) {
        log( '  copying "static" directory' );
        await ( 0, _recursiveCopy.recursiveCopy )( ( 0, _path.join )( dir, 'static' ), ( 0, _path.join )( outDir, 'static' ) );
    }

    // Copy .next/static directory
    if ( ( 0, _fs.existsSync )( ( 0, _path.join )( distDir, _constants2.CLIENT_STATIC_FILES_PATH ) ) ) {
        log( '  copying "static build" directory' );
        await ( 0, _recursiveCopy.recursiveCopy )(
            ( 0, _path.join )( distDir, _constants2.CLIENT_STATIC_FILES_PATH ),
            ( 0, _path.join )( outDir, '_next', _constants2.CLIENT_STATIC_FILES_PATH ) );

    }

    // Get the exportPathMap from the config file
    if ( typeof nextConfig.exportPathMap !== 'function' ) {
        console.log(
            `> No "exportPathMap" found in "${_constants2.CONFIG_FILE}". Generating map from "./pages"` );

        nextConfig.exportPathMap = async defaultMap => {
            return defaultMap;
        };
    }

    // Start the rendering process
    const renderOpts = {
        dir,
        buildId,
        nextExport: true,
        assetPrefix: nextConfig.assetPrefix.replace( /\/$/, '' ),
        distDir,
        dev: false,
        staticMarkup: false,
        hotReloader: null,
        canonicalBase: ( ( _nextConfig$amp = nextConfig.amp ) === null || _nextConfig$amp === void 0 ? void 0 : _nextConfig$amp.canonicalBase ) || '',
        isModern: nextConfig.experimental.modern,
        ampValidatorPath: ( ( _nextConfig$experimen = nextConfig.experimental.amp ) === null || _nextConfig$experimen === void 0 ? void 0 : _nextConfig$experimen.validator ) || undefined
    };


    const
        {
            serverRuntimeConfig,
            publicRuntimeConfig
        } = nextConfig;

    if ( Object.keys( publicRuntimeConfig ).length > 0 ) {
        ;
        renderOpts.runtimeConfig = publicRuntimeConfig;
    }

    // We need this for server rendering the Link component.
    ;
    global.__NEXT_DATA__ = {
        nextExport: true
    };


    log( `  launching ${threads} workers` );
    const exportPathMap = await nextConfig.exportPathMap( defaultPathMap,
        {
            dev: false,
            dir,
            outDir,
            distDir,
            buildId
        } );

    if ( !exportPathMap['/404'] && !exportPathMap['/404.html'] ) {
        exportPathMap['/404'] = exportPathMap['/404.html'] = {
            page: '/_error'
        };

    }
    const exportPaths = Object.keys( exportPathMap );
    const filteredPaths = exportPaths.filter(
        // Remove API routes
        route => !exportPathMap[route].page.match( _constants.API_ROUTE ) );

    const hasApiRoutes = exportPaths.length !== filteredPaths.length;

    // Warn if the user defines a path for an API page
    if ( hasApiRoutes ) {
        log(
            _chalk.default.yellow(
                '  API pages are not supported by next export. https://err.sh/zeit/next.js/api-routes-static-export' ) );


    }

    const progress = !options.silent && createProgress( filteredPaths.length );
    const pagesDataDir = options.buildExport ?
        outDir :
        ( 0, _path.join )( outDir, '_next/data', buildId );

    const ampValidations = {};
    let hadValidationError = false;

    const publicDir = ( 0, _path.join )( dir, _constants2.CLIENT_PUBLIC_FILES_PATH );
    // Copy public directory
    if ( !options.buildExport && ( 0, _fs.existsSync )( publicDir ) ) {
        log( '  copying "public" directory' );
        await ( 0, _recursiveCopy.recursiveCopy )( publicDir, outDir,
            {
                filter( path ) {
                    // Exclude paths used by pages
                    return !exportPathMap[path];
                }
            } );

    }

    const worker = new _jestWorker.default(
        require.resolve( './worker' ),
        {
            maxRetries: 0,
            numWorkers: threads,
            enableWorkerThreads: nextConfig.experimental.workerThreads,
            exposedMethods: ['default']
        } );



    worker.getStdout().pipe( process.stdout );
    worker.getStderr().pipe( process.stderr );

    let renderError = false;

    await Promise.all(
        filteredPaths.map( async path => {
            const result = await worker.default(
                {
                    path,
                    pathMap: exportPathMap[path],
                    distDir,
                    buildId,
                    outDir,
                    pagesDataDir,
                    renderOpts,
                    serverRuntimeConfig,
                    subFolders,
                    buildExport: options.buildExport,
                    serverless: ( 0, _config.isTargetLikeServerless )( nextConfig.target )
                } );


            for ( const validation of result.ampValidations || [] ) {
                const
                    {
                        page,
                        result
                    } = validation;
                ampValidations[page] = result;
                hadValidationError =
                    hadValidationError ||
                    Array.isArray( result === null || result === void 0 ? void 0 : result.errors ) && result.errors.length > 0;
            }
            renderError = renderError || !!result.error;

            if (
                options.buildExport &&
                typeof result.fromBuildExportRevalidate !== 'undefined' ) {
                configuration.initialPageRevalidationMap[path] =
                    result.fromBuildExportRevalidate;
            }
            if ( progress ) progress();
        } ) );


    worker.end();

    // copy prerendered routes to outDir
    if ( !options.buildExport && prerenderManifest ) {
        await Promise.all(
            Object.keys( prerenderManifest.routes ).map( async route => {
                route = ( 0, _normalizePagePath.normalizePagePath )( route );
                const orig = ( 0, _path.join )( distPagesDir, route );
                const htmlDest = ( 0, _path.join )(
                    outDir,
                    `${route}${
                    subFolders && route !== '/index' ? `${_path.sep}index` : ''
                    }.html` );

                const jsonDest = ( 0, _path.join )( pagesDataDir, `${route}.json` );

                await mkdirp( ( 0, _path.dirname )( htmlDest ) );
                await mkdirp( ( 0, _path.dirname )( jsonDest ) );
                await copyFile( `${orig}.html`, htmlDest );
                await copyFile( `${orig}.json`, jsonDest );
            } ) );

    }

    if ( Object.keys( ampValidations ).length ) {
        console.log( ( 0, _index.formatAmpMessages )( ampValidations ) );
    }
    if ( hadValidationError ) {
        throw new Error(
            `AMP Validation caused the export to fail. https://err.sh/zeit/next.js/amp-export-validation` );

    }

    if ( renderError ) {
        throw new Error( `Export encountered errors` );
    }
    // Add an empty line to the console for the better readability.
    log( '' );

    ( 0, _fs.writeFileSync )(
        ( 0, _path.join )( distDir, _constants2.EXPORT_DETAIL ),
        JSON.stringify(
            {
                version: 1,
                outDirectory: outDir,
                success: true
            } ),

        'utf8' );


    if ( telemetry ) {
        await telemetry.flush();
    }
}