"use strict";
exports.__esModule = true;
exports.collectPages = collectPages;
exports.printTreeView = printTreeView;
exports.printCustomRoutes = printCustomRoutes;
exports.getSharedSizes = getSharedSizes;
exports.getPageSizeInKb = getPageSizeInKb;
exports.buildStaticPaths = buildStaticPaths;
exports.isPageStatic = isPageStatic;
exports.hasCustomGetInitialProps = hasCustomGetInitialProps;
var _chalk = _interopRequireDefault(require("chalk"));
var _gzipSize = _interopRequireDefault(require("gzip-size"));
var _textTable = _interopRequireDefault(require("next/dist/compiled/text-table"));
var _path = _interopRequireDefault(require("path"));
var _reactIs = require("react-is");
var _stripAnsi = _interopRequireDefault(require("strip-ansi"));

var _constants = require("../lib/constants");




var _prettyBytes = _interopRequireDefault(require("../lib/pretty-bytes"));
var _recursiveReaddir = require("../lib/recursive-readdir");
var _utils = require("../next-server/lib/router/utils");
var _isDynamic = require("../next-server/lib/router/utils/is-dynamic");
var _findPageFile = require("../server/lib/find-page-file");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


const fileGzipStats = {};
const fsStatGzip = file => {
    if (fileGzipStats[file]) return fileGzipStats[file];
    fileGzipStats[file] = _gzipSize.default.file(file);
    return fileGzipStats[file];
};

function collectPages(directory, pageExtensions) {
    return (0, _recursiveReaddir.recursiveReadDir)(
        directory,
        new RegExp(`\\.(?:${pageExtensions.join('|')})$`));
}

async function printTreeView(
    list,
    pageInfos,
    serverless, {
        distPath,
        buildId,
        pagesDir,
        pageExtensions,
        buildManifest,
        isModern,
        useStatic404
    })
{
    const getPrettySize = _size => {
        const size = (0, _prettyBytes.default)(_size);
        // green for 0-130kb
        if (_size < 130 * 1000) return _chalk.default.green(size);
        // yellow for 130-170kb
        if (_size < 170 * 1000) return _chalk.default.yellow(size);
        // red for >= 170kb
        return _chalk.default.red.bold(size);
    };

    const messages = [
        ['Page', 'Size', 'First Load'].map(entry => _chalk.default.underline(entry))
    ];




    const hasCustomApp = await (0, _findPageFile.findPageFile)(pagesDir, '/_app', pageExtensions);
    const hasCustomError = await (0, _findPageFile.findPageFile)(pagesDir, '/_error', pageExtensions);

    if (useStatic404) {
        pageInfos.set('/404', {
            ...(pageInfos.get('/404') || pageInfos.get('/_error')),
            static: true
        });

        list = [...list, '/404'];
    }

    const pageList = list.
    slice().
    filter(
        (e) =>
        !(
            e === '/_document' ||
            !hasCustomApp && e === '/_app' ||
            !hasCustomError && e === '/_error')).


    sort((a, b) => a.localeCompare(b));

    pageList.forEach((item, i, arr) => {
        var _pageInfo$ssgPageRout;
        const symbol =
            i === 0 ?
            arr.length === 1 ?
            '─' :
            '┌' :
            i === arr.length - 1 ?
            '└' :
            '├';

        const pageInfo = pageInfos.get(item);

        messages.push([
            `${symbol} ${
item==='/_app'?
' ':
(pageInfo===null||pageInfo===void 0?void 0:pageInfo.static)?
'○':
(pageInfo===null||pageInfo===void 0?void 0:pageInfo.isSsg)?
'●':
'λ'
} ${item}`,
            pageInfo ?
            pageInfo.isAmp ?
            _chalk.default.cyan('AMP') :
            pageInfo.size >= 0 ?
            (0, _prettyBytes.default)(pageInfo.size) :
            '' :
            '',
            pageInfo ?
            pageInfo.isAmp ?
            _chalk.default.cyan('AMP') :
            pageInfo.size >= 0 ?
            getPrettySize(pageInfo.totalSize) :
            '' :
            ''
        ]);


        if (pageInfo === null || pageInfo === void 0 ? void 0 : (_pageInfo$ssgPageRout = pageInfo.ssgPageRoutes) === null || _pageInfo$ssgPageRout === void 0 ? void 0 : _pageInfo$ssgPageRout.length) {
            const totalRoutes = pageInfo.ssgPageRoutes.length;
            const previewPages = totalRoutes === 4 ? 4 : 3;
            const contSymbol = i === arr.length - 1 ? ' ' : '├';

            const routes = pageInfo.ssgPageRoutes.slice(0, previewPages);
            if (totalRoutes > previewPages) {
                const remaining = totalRoutes - previewPages;
                routes.push(`[+${remaining} more paths]`);
            }

            routes.forEach((slug, index, {
                length
            }) => {
                const innerSymbol = index === length - 1 ? '└' : '├';
                messages.push([`${contSymbol}   ${innerSymbol} ${slug}`, '', '']);
            });
        }
    });

    const sharedData = await getSharedSizes(
        distPath,
        buildManifest,
        buildId,
        isModern,
        pageInfos);


    messages.push(['+ shared by all', getPrettySize(sharedData.total), '']);
    Object.keys(sharedData.files).
    map(e => e.replace(buildId, '<buildId>')).
    sort().
    forEach((fileName, index, {
        length
    }) => {
        const innerSymbol = index === length - 1 ? '└' : '├';

        const originalName = fileName.replace('<buildId>', buildId);
        const cleanName = fileName
            // Trim off `static/`
            .replace(/^static\//, '')
            // Re-add `static/` for root files
            .replace(/^<buildId>/, 'static')
            // Remove file hash
            .replace(/[.-]([0-9a-z]{6})[0-9a-z]{14}(?=\.)/, '.$1');

        messages.push([
            `  ${innerSymbol} ${cleanName}`,
            (0, _prettyBytes.default)(sharedData.files[originalName]),
            ''
        ]);

    });

    console.log(
        (0, _textTable.default)(messages, {
            align: ['l', 'l', 'r'],
            stringLength: str => (0, _stripAnsi.default)(str).length
        }));



    console.log();
    console.log(
        (0, _textTable.default)(
            [
                [
                    'λ',
                    serverless ? '(Lambda)' : '(Server)',
                    `server-side renders at runtime (uses ${_chalk.default.cyan(
'getInitialProps')
} or ${_chalk.default.cyan('getServerSideProps')})`
                ],

                [
                    '○',
                    '(Static)',
                    'automatically rendered as static HTML (uses no initial props)'
                ],

                [
                    '●',
                    '(SSG)',
                    `automatically generated as static HTML + JSON (uses ${_chalk.default.cyan(
'getStaticProps')
})`
                ]
            ],


            {
                align: ['l', 'l', 'l'],
                stringLength: str => (0, _stripAnsi.default)(str).length
            }));




    console.log();
}

function printCustomRoutes({
    redirects,
    rewrites,
    headers
})




{
    const printRoutes = (
        routes,
        type) => {
        const isRedirects = type === 'Redirects';
        const isHeaders = type === 'Headers';
        console.log(_chalk.default.underline(type));
        console.log();

        /*
                ┌ source
                ├ permanent/statusCode
                └ destination
             */
        const routesStr = routes.
        map(route => {
            let routeStr = `┌ source: ${route.source}\n`;

            if (!isHeaders) {
                const r = route;
                routeStr += `${isRedirects?'├':'└'} destination: ${
r.destination
}\n`;
            }
            if (isRedirects) {
                const r = route;
                routeStr += `└ ${
r.statusCode?
`status: ${r.statusCode}`:
`permanent: ${r.permanent}`
}\n`;
            }

            if (isHeaders) {
                const r = route;
                routeStr += `└ headers:\n`;

                for (let i = 0; i < r.headers.length; i++) {
                    const header = r.headers[i];
                    const last = i === headers.length - 1;

                    routeStr += `  ${last?'└':'├'} ${header.key}: ${header.value}\n`;
                }
            }

            return routeStr;
        }).
        join('\n');

        console.log(routesStr, '\n');
    };

    if (redirects.length) {
        printRoutes(redirects, 'Redirects');
    }
    if (rewrites.length) {
        printRoutes(rewrites, 'Rewrites');
    }
    if (headers.length) {
        printRoutes(headers, 'Headers');
    }
}




let cachedBuildManifest;

let lastCompute;
let lastComputeModern;
let lastComputePageInfo;

async function computeFromManifest(
    manifest,
    distPath,
    buildId,
    isModern,
    pageInfos) {
    if (
        Object.is(cachedBuildManifest, manifest) &&
        lastComputeModern === isModern &&
        lastComputePageInfo === !!pageInfos) {
        return lastCompute;
    }

    let expected = 0;
    const files = new Map();
    Object.keys(manifest.pages).forEach(key => {
        if (key === '/_polyfills') {
            return;
        }

        if (pageInfos) {
            const cleanKey = key.replace(/\/index$/, '') || '/';
            const pageInfo = pageInfos.get(cleanKey);
            // don't include AMP pages since they don't rely on shared bundles
            if ((pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.isHybridAmp) || (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.isAmp)) {
                return;
            }
        }

        ++expected;
        manifest.pages[key].forEach(file => {
            if (
                // Filter out CSS
                !file.endsWith('.js') ||
                // Select Modern or Legacy scripts
                file.endsWith('.module.js') !== isModern) {
                return;
            }

            if (key === '/_app') {
                files.set(file, Infinity);
            } else if (files.has(file)) {
                files.set(file, files.get(file) + 1);
            } else {
                files.set(file, 1);
            }
        });
    });

    // Add well-known shared file
    files.set(
        _path.default.posix.join(
            `static/${buildId}/pages/`,
            `/_app${isModern?'.module':''}.js`),

        Infinity);


    const commonFiles = [...files.entries()].
    filter(([, len]) => len === expected || len === Infinity).
    map(([f]) => f);
    const uniqueFiles = [...files.entries()].
    filter(([, len]) => len === 1).
    map(([f]) => f);

    let stats;
    try {
        stats = await Promise.all(
            commonFiles.map(
                async (f) => [f, await fsStatGzip(_path.default.join(distPath, f))]));


    } catch (_) {
        stats = [];
    }

    lastCompute = {
        commonFiles,
        uniqueFiles,
        sizeCommonFile: stats.reduce(
            (obj, n) => Object.assign(obj, {
                [n[0]]: n[1]
            }), {}),

        sizeCommonFiles: stats.reduce((size, [, stat]) => size + stat, 0)
    };


    cachedBuildManifest = manifest;
    lastComputeModern = isModern;
    lastComputePageInfo = !!pageInfos;
    return lastCompute;
}

function difference(main, sub) {
    const a = new Set(main);
    const b = new Set(sub);
    return [...a].filter(x => !b.has(x));
}

function intersect(main, sub) {
    const a = new Set(main);
    const b = new Set(sub);
    return [...new Set([...a].filter(x => b.has(x)))];
}

function sum(a) {
    return a.reduce((size, stat) => size + stat, 0);
}

async function getSharedSizes(
    distPath,
    buildManifest,
    buildId,
    isModern,
    pageInfos) {
    const data = await computeFromManifest(
        buildManifest,
        distPath,
        buildId,
        isModern,
        pageInfos);

    return {
        total: data.sizeCommonFiles,
        files: data.sizeCommonFile
    };
}

async function getPageSizeInKb(
    page,
    distPath,
    buildId,
    buildManifest,
    isModern) {
    const data = await computeFromManifest(
        buildManifest,
        distPath,
        buildId,
        isModern);


    const fnFilterModern = (entry) =>
        entry.endsWith('.js') && entry.endsWith('.module.js') === isModern;

    const pageFiles = (buildManifest.pages[page] || []).filter(fnFilterModern);
    const appFiles = (buildManifest.pages['/_app'] || []).filter(fnFilterModern);

    const fnMapRealPath = dep => `${distPath}/${dep}`;

    const allFilesReal = [...new Set([...pageFiles, ...appFiles])].map(
        fnMapRealPath);

    const selfFilesReal = difference(
        intersect(pageFiles, data.uniqueFiles),
        data.commonFiles).
    map(fnMapRealPath);

    const clientBundle = _path.default.join(
        distPath,
        `static/${buildId}/pages/`,
        `${page}${isModern?'.module':''}.js`);

    const appBundle = _path.default.join(
        distPath,
        `static/${buildId}/pages/`,
        `/_app${isModern?'.module':''}.js`);

    selfFilesReal.push(clientBundle);
    allFilesReal.push(clientBundle);
    if (clientBundle !== appBundle) {
        allFilesReal.push(appBundle);
    }

    try {
        // Doesn't use `Promise.all`, as we'd double compute duplicate files. This
        // function is memoized, so the second one will instantly resolve.
        const allFilesSize = sum((await Promise.all(allFilesReal.map(fsStatGzip))));
        const selfFilesSize = sum((await Promise.all(selfFilesReal.map(fsStatGzip))));
        return [selfFilesSize, allFilesSize];
    } catch (_) {}
    return [-1, -1];
}

async function buildStaticPaths(
    page,
    getStaticPaths) {
    const prerenderPaths = new Set();
    const _routeRegex = (0, _utils.getRouteRegex)(page);
    const _routeMatcher = (0, _utils.getRouteMatcher)(_routeRegex);

    // Get the default list of allowed params.
    const _validParamKeys = Object.keys(_routeMatcher(page));

    const staticPathsResult = await getStaticPaths();

    const expectedReturnVal =
        `Expected: { paths: [], fallback: boolean }\n` +
        `See here for more info: https://err.sh/zeit/next.js/invalid-getstaticpaths-value`;

    if (
        !staticPathsResult ||
        typeof staticPathsResult !== 'object' ||
        Array.isArray(staticPathsResult)) {
        throw new Error(
            `Invalid value returned from getStaticPaths in ${page}. Received ${typeof staticPathsResult} ${expectedReturnVal}`);

    }

    const invalidStaticPathKeys = Object.keys(staticPathsResult).filter(
        key => !(key === 'paths' || key === 'fallback'));


    if (invalidStaticPathKeys.length > 0) {
        throw new Error(
            `Extra keys returned from getStaticPaths in ${page} (${invalidStaticPathKeys.join(
', ')
}) ${expectedReturnVal}`);

    }

    if (typeof staticPathsResult.fallback !== 'boolean') {
        throw new Error(
            `The \`fallback\` key must be returned from getStaticPaths in ${page}.\n` +
            expectedReturnVal);

    }

    const toPrerender = staticPathsResult.paths;

    if (!Array.isArray(toPrerender)) {
        throw new Error(
            `Invalid \`paths\` value returned from getStaticProps in ${page}.\n` +
            `\`paths\` must be an array of strings or objects of shape { params: [key: string]: string }`);

    }

    toPrerender.forEach(entry => {
        // For a string-provided path, we must make sure it matches the dynamic
        // route.
        if (typeof entry === 'string') {
            const result = _routeMatcher(entry);
            if (!result) {
                throw new Error(
                    `The provided path \`${entry}\` does not match the page: \`${page}\`.`);

            }

            prerenderPaths === null || prerenderPaths === void 0 ? void 0 : prerenderPaths.add(entry);
        }
        // For the object-provided path, we must make sure it specifies all
        // required keys.
        else {
            const invalidKeys = Object.keys(entry).filter(key => key !== 'params');
            if (invalidKeys.length) {
                throw new Error(
                    `Additional keys were returned from \`getStaticPaths\` in page "${page}". ` +
                    `URL Parameters intended for this dynamic route must be nested under the \`params\` key, i.e.:` +
                    `\n\n\treturn { params: { ${_validParamKeys.
map(k=>`${k}: ...`).
join(', ')} } }` +
                    `\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.\n`);

            }

            const {
                params = {}
            } = entry;
            let builtPage = page;
            _validParamKeys.forEach(validParamKey => {
                const {
                    repeat
                } = _routeRegex.groups[validParamKey];
                const paramValue = params[validParamKey];
                if (
                    repeat && !Array.isArray(paramValue) ||
                    !repeat && typeof paramValue !== 'string') {
                    throw new Error(
                        `A required parameter (${validParamKey}) was not provided as ${
repeat?'an array':'a string'
} in getStaticPaths for ${page}`);

                }

                builtPage = builtPage.replace(
                    `[${repeat?'...':''}${validParamKey}]`,
                    repeat ?
                    paramValue.map(encodeURIComponent).join('/') :
                    encodeURIComponent(paramValue));

            });

            prerenderPaths === null || prerenderPaths === void 0 ? void 0 : prerenderPaths.add(builtPage);
        }
    });

    return {
        paths: [...prerenderPaths],
        fallback: staticPathsResult.fallback
    };
}

async function isPageStatic(
    page,
    serverBundle,
    runtimeEnvConfig)




{
    try {
        require('../next-server/lib/runtime-config').setConfig(runtimeEnvConfig);
        const mod = require(serverBundle);
        const Comp = mod.default || mod;

        if (!Comp || !(0, _reactIs.isValidElementType)(Comp) || typeof Comp === 'string') {
            throw new Error('INVALID_DEFAULT_EXPORT');
        }

        const hasGetInitialProps = !!Comp.getInitialProps;
        const hasStaticProps = !!mod.getStaticProps;
        const hasStaticPaths = !!mod.getStaticPaths;
        const hasServerProps = !!mod.getServerSideProps;
        const hasLegacyServerProps = !!mod.unstable_getServerProps;
        const hasLegacyStaticProps = !!mod.unstable_getStaticProps;
        const hasLegacyStaticPaths = !!mod.unstable_getStaticPaths;
        const hasLegacyStaticParams = !!mod.unstable_getStaticParams;

        if (hasLegacyStaticParams) {
            throw new Error(
                `unstable_getStaticParams was replaced with getStaticPaths. Please update your code.`);

        }

        if (hasLegacyStaticPaths) {
            throw new Error(
                `unstable_getStaticPaths was replaced with getStaticPaths. Please update your code.`);

        }

        if (hasLegacyStaticProps) {
            throw new Error(
                `unstable_getStaticProps was replaced with getStaticProps. Please update your code.`);

        }

        if (hasLegacyServerProps) {
            throw new Error(
                `unstable_getServerProps was replaced with getServerSideProps. Please update your code.`);

        }

        // A page cannot be prerendered _and_ define a data requirement. That's
        // contradictory!
        if (hasGetInitialProps && hasStaticProps) {
            throw new Error(_constants.SSG_GET_INITIAL_PROPS_CONFLICT);
        }

        if (hasGetInitialProps && hasServerProps) {
            throw new Error(_constants.SERVER_PROPS_GET_INIT_PROPS_CONFLICT);
        }

        if (hasStaticProps && hasServerProps) {
            throw new Error(_constants.SERVER_PROPS_SSG_CONFLICT);
        }

        const pageIsDynamic = (0, _isDynamic.isDynamicRoute)(page);
        // A page cannot have static parameters if it is not a dynamic page.
        if (hasStaticProps && hasStaticPaths && !pageIsDynamic) {
            throw new Error(
                `getStaticPaths can only be used with dynamic pages, not '${page}'.` +
                `\nLearn more: https://nextjs.org/docs#dynamic-routing`);

        }

        if (hasStaticProps && pageIsDynamic && !hasStaticPaths) {
            throw new Error(
                `getStaticPaths is required for dynamic SSG pages and is missing for '${page}'.` +
                `\nRead more: https://err.sh/next.js/invalid-getstaticpaths-value`);

        }

        let prerenderRoutes;
        let prerenderFallback;
        if (hasStaticProps && hasStaticPaths) {
            ;
            ({
                    paths: prerenderRoutes,
                    fallback: prerenderFallback
                } =
                await buildStaticPaths(page, mod.getStaticPaths));
        }

        const config = mod.config || {};
        return {
            isStatic: !hasStaticProps && !hasGetInitialProps && !hasServerProps,
            isHybridAmp: config.amp === 'hybrid',
            prerenderRoutes,
            prerenderFallback,
            hasStaticProps,
            hasServerProps
        };

    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') return {};
        throw err;
    }
}

function hasCustomGetInitialProps(
    bundle,
    runtimeEnvConfig) {
    require('../next-server/lib/runtime-config').setConfig(runtimeEnvConfig);
    let mod = require(bundle);

    if (bundle.endsWith('_app.js') || bundle.endsWith('_error.js')) {
        mod = mod.default || mod;
    } else {
        // since we don't output _app in serverless mode get it from a page
        mod = mod._app;
    }
    return mod.getInitialProps !== mod.origGetInitialProps;
}