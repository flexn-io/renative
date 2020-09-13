import resolve from 'resolve';
import fs from 'fs';
import path from 'path';
/**
 * An attempt at drying out filesystem references to [external packages](https://tinyurl.com/mao2dy6).
 *
 * We access external packages for a number of reasons:
 *  - to simply resolve a non-scoped package's (absolute) path on disk. e.g. '/var/project/node_modules/react-native'
 *  - to resolve a scoped package's (absolute) path on disk. e.g. '/var/project/node_modules/@aScope/react-native'
 *  - to resolve an individual file/dir's (absolute) path on disk. e.g. '/var/project/node_modules/react-native/blur/android' (note this is a normally illegal package reference)
 *  - to resolve an individual file (absolute) path on disk by FS relative reference. e.g. '/var/project/node_modules/react-native/relPath'
 *
 * ** Please note that we do not support [subpackage paths](https://tinyurl.com/vub6c7t). All suffixed paths (e.g. 'react-native/SUFFIX_PATH', '@aScope/react-native/SUFFIX_PATH')
 * will be treated as a filepath from root of resolved package (i.e. will ignore subdirectory package.json)
 *
 * @param {*} aPath - package name. e.g. 'file:../rel/path', 'react-native', 'react-native/android', '@react-native-community/masked-view/android'
 * @param {*} mandatory - whether it throws
 * @param {*} options - docs - https://tinyurl.com/r9sfpf7 && {keepSuffix: boolean}
 */
export const doResolve = (aPath, mandatory = true, options = {}) => {
    options.basedir = options.basedir ?? process.cwd();
    try {
        if (aPath.startsWith('file:')) {
            return _withPathFix(_doResolveFSPath(aPath, options), options?.forceForwardPaths);
        }
        return _withPathFix(_doResolveExternalPackage(aPath, options), options?.forceForwardPaths);
    } catch (err) {
        // perhaps do some warning logging here..
        if (mandatory) throw err;
    }
};

const _withPathFix = (p, forceForwardPaths) => {
    if (p && forceForwardPaths) {
        return p.replace(/\\/g, '/');
    }
    return p;
};

export const doResolvePath = (aPath, mandatory = true, options = {}, fallbackBase = '') => {
    options.basedir = options.basedir ?? process.cwd();

    try {
        const pathArr = aPath.split('/');
        // Take care of scenario when someone wrote: "/node_modules/.." instead of "node_modules/..."
        if (pathArr[0] === '') {
            pathArr.shift();
        }
        if (pathArr[0] === 'node_modules') {
            pathArr.shift();
        }
        if (pathArr[0] === 'packages') {
            pathArr.shift();
        }
        const cleanPath = pathArr.join('/');
        if (pathArr[0].startsWith('@')) {
            pathArr.shift();
        }
        pathArr.shift();
        const realPath = doResolve(cleanPath, mandatory, options);
        if (realPath) {
            return _withPathFix(path.join(realPath, ...pathArr), options?.forceForwardPaths);
        }
        return _withPathFix(path.join(fallbackBase, aPath), options?.forceForwardPaths);
    } catch (err) {
        if (mandatory) throw err;
    }
};

export const isScopedPackagePath = (aPath) => {
    if (aPath.startsWith('@')) {
        if (!aPath.includes('/')) {
            throw new Error(
                `Scoped packages must include subpackage portion e.g. '@aScope/subpackage'. Supplied path: ${aPath}`
            );
        }
        return true;
    }
};

const _getPackagePathParts = (aPath) => {
    let parts = [];
    if (isScopedPackagePath(aPath)) {
        parts = aPath.match(/^([^/]+\/[^/]+)(?:\/?(.*))/);
    } else {
        parts = aPath.match(/^([^/]+)\/?(.*)/);
    }
    if (!Array.isArray(parts)) {
        throw new Error(`Unsuitable path for resolving: ${aPath}`);
    }
    return parts.slice(1);
};

/**
 * We support path linking using 'file:' protocol (not part of official node resolution alg.)
 */
const _doResolveFSPath = (aPath, options) => {
    const fileRelPath = `${
        options.basedir ? `${options.basedir}/`.replace(/.*\/+$/, '/') : ''
    }${aPath.replace('file:', '')}`;
    if (!fs.existsSync(fileRelPath)) {
        throw new Error(
            `Explicit filepath ${aPath} does not resolve to dir or file`
        );
    }
    return fileRelPath;
};

/**
 * @see 'LOAD_NODE_MODULES' of node resolution alg. - https://tinyurl.com/pgz6f33
 */
const _doResolveExternalPackage = (aPath, options) => {
    const [packageBase, packageSuffix] = _getPackagePathParts(aPath);

    try {
        const resolvedPath = resolve
            .sync(packageBase, {
                packageFilter: (pkg) => {
                    pkg.main = 'package.json';
                    return pkg;
                },
                ...options,
                extensions: ['.js', '.json'].concat(options.extensions ?? [])
            })
            .replace(/(\\|\/)package.json$/, '');
        return options.keepSuffix ?? false
            ? `${resolvedPath}/${packageSuffix}`
            : resolvedPath;
    } catch (e) {
        return null;
    }
};
