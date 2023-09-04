import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import Svg2Js from 'svg2js';
import shelljs from 'shelljs';
import merge from 'deepmerge';
import ncp from 'ncp';
import { chalk, logDebug, logError, logWarning } from './logger';
import { RnvContext } from '../context/types';
import {
    DoResolveFn,
    FileUtilsPropConfig,
    FileUtilsUpdateConfig,
    OverridesOptions,
    TimestampPathsConfig,
} from './types';
import type { GetConfigPropFn } from '../types';

export const configureFilesystem = (
    _getConfigProp: GetConfigPropFn,
    _doResolve: DoResolveFn,
    _isSystemWin: boolean
) => {
    global._getConfigProp = _getConfigProp;
    global._doResolve = _doResolve;
    global._isSystemWin = _isSystemWin;
};

export const fsWriteFileSync = (dest: string | undefined, data: string, options?: fs.WriteFileOptions) => {
    // if (dest && dest.includes('renative.json')) {
    //     console.log('FS_WRITE', dest, data.length);
    // }
    if (!dest) return;
    fs.writeFileSync(dest, data, options);
};

export const fsCopyFileSync = (source: string, dest: string) => {
    // console.log('FS_COPY', source);
    fs.copyFileSync(source, dest);
};

export const fsExistsSync = (dest: fs.PathLike | undefined) => fs.existsSync(dest!);

export const fsReaddirSync = (dest: fs.PathLike | undefined) => fs.readdirSync(dest!);

export const fsLstatSync = (dest: fs.PathLike | undefined) => fs.lstatSync(dest!);

export const fsReadFileSync = (dest: fs.PathLike | undefined) => fs.readFileSync(dest!);

export const fsChmodSync = (dest: fs.PathLike | undefined, flag: fs.Mode) => fs.chmodSync(dest!, flag);

export const fsRenameSync = (arg1: fs.PathLike | undefined, arg2: fs.PathLike) => fs.renameSync(arg1!, arg2);

export const fsStatSync = (arg1: fs.PathLike | undefined) => fs.statSync(arg1!);

export const fsMkdirSync = (arg1: fs.PathLike | undefined) => fs.mkdirSync(arg1!);

export const fsUnlinkSync = (arg1: fs.PathLike | undefined) => fs.unlinkSync(arg1!);

export const fsSymlinkSync = (arg1: fs.PathLike | undefined, arg2: fs.PathLike) => {
    fs.symlinkSync(arg1!, arg2);
};

export const fsReadFile = (arg1: fs.PathLike, arg2: any) => {
    fs.readFile(arg1, arg2);
};

export const fsReaddir = (arg1: fs.PathLike, arg2: any) => fs.readdir(arg1, arg2);

const _getSanitizedPath = (origPath: string, timestampPathsConfig?: TimestampPathsConfig) => {
    if (timestampPathsConfig?.paths?.length && timestampPathsConfig?.timestamp) {
        const pths = timestampPathsConfig.paths;
        if (pths.includes(origPath)) {
            const ext = path.extname(origPath);
            const fileName = path.basename(origPath, ext);
            const dirPath = path.dirname(origPath);
            const newPath = path.join(dirPath, `${fileName}-${timestampPathsConfig.timestamp}${ext}`);
            return newPath;
        }
    }
    return origPath;
};

export const copyFileSync = (
    source: string | undefined,
    target: string | undefined,
    skipOverride?: boolean,
    timestampPathsConfig?: TimestampPathsConfig
) => {
    if (!target) return;
    if (!source) return;
    logDebug('copyFileSync', source);
    let targetFile = target;
    // if target is a directory a new file with the same name will be created
    if (source.indexOf('.DS_Store') !== -1) return;

    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    if (fs.existsSync(targetFile)) {
        if (skipOverride) return;
        const src = fs.readFileSync(source);
        const dst = fs.readFileSync(targetFile);

        if (Buffer.compare(src, dst) === 0) return;
    }
    logDebug('copyFileSync', source, targetFile, 'executed');
    try {
        fsCopyFileSync(source, _getSanitizedPath(targetFile, timestampPathsConfig));
    } catch (e) {
        logDebug('copyFileSync', e);
    }
};

const SKIP_INJECT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.jar', '.zip', '.ico'];
export const writeCleanFile = (
    source: string,
    destination: string,
    overrides?: OverridesOptions,
    timestampPathsConfig?: TimestampPathsConfig,
    c?: RnvContext
) => {
    // logTask(`writeCleanFile`)
    // console.log('writeCleanFile', destination);
    if (!fs.existsSync(source)) {
        logError(`Cannot write file. source path doesn't exists: ${source}`);
        return;
    }
    if (!fs.existsSync(destination)) {
        logDebug(`destination path doesn't exists: ${destination}. will create new one`);
        // return;
    }
    const ext = path.extname(source);
    if (SKIP_INJECT_EXTENSIONS.includes(ext)) {
        fsCopyFileSync(source, _getSanitizedPath(destination, timestampPathsConfig));
    } else {
        const pFile = fs.readFileSync(source, 'utf8');
        if (/\ufffd/.test(pFile) === true) {
            // Handle uncaught binary files
            fsCopyFileSync(source, _getSanitizedPath(destination, timestampPathsConfig));
        } else {
            let pFileClean = pFile;
            if (overrides?.forEach) {
                overrides.forEach((v) => {
                    const regEx = new RegExp(v.pattern, 'g');
                    pFileClean = pFileClean.replace(regEx, v.override);
                });
            }
            if (c) {
                const regEx = /{{configProps.([\s\S]*?)}}/g;
                const occurences = pFileClean.match(regEx);
                if (occurences) {
                    occurences.forEach((occ) => {
                        const val = occ.replace('{{configProps.', '').replace('}}', '');
                        const configVal = global._getConfigProp(c, c.platform, val, '');
                        pFileClean = pFileClean.replace(occ, configVal);
                    });
                }
            }
            fsWriteFileSync(_getSanitizedPath(destination, timestampPathsConfig), pFileClean, 'utf8');
        }
    }
};

export const readCleanFile = (source: string, overrides?: OverridesOptions) => {
    // logTask(`writeCleanFile`)
    // console.log('readCleanFile', source);
    if (!fs.existsSync(source)) {
        logError(`Cannot read file. source path doesn't exists: ${source}`);
        return;
    }

    const pFile = fs.readFileSync(source, 'utf8');
    let pFileClean = pFile;
    if (overrides?.forEach) {
        overrides.forEach((v) => {
            const regEx = new RegExp(v.pattern, 'g');
            pFileClean = pFileClean.replace(regEx, v.override);
        });
    }

    return Buffer.from(pFileClean, 'utf8');
};

export const copyFileWithInjectSync = (
    source: string,
    target: string,
    skipOverride?: boolean,
    injectObject?: OverridesOptions,
    timestampPathsConfig?: TimestampPathsConfig,
    c?: RnvContext
) => {
    logDebug('copyFileWithInjectSync', source);

    let targetFile = target;
    // if target is a directory a new file with the same name will be created
    if (source.indexOf('.DS_Store') !== -1) return;

    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    if (fs.existsSync(targetFile)) {
        if (skipOverride) return;
        const src = readCleanFile(source, injectObject);
        const dst = fs.readFileSync(targetFile);

        if (src && Buffer.compare(src, dst) === 0) return;
    }
    logDebug('copyFileSync', source, targetFile, 'executed');

    try {
        writeCleanFile(source, targetFile, injectObject, timestampPathsConfig, c);
    } catch (e) {
        logDebug('copyFileSync', e);
    }
};

export const invalidatePodsChecksum = (c: RnvContext) => {
    const appFolder = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.platform}`);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    if (fs.existsSync(podChecksumPath)) {
        fs.unlinkSync(podChecksumPath);
    }
};

export const copyFolderRecursiveSync = (
    source: string,
    target: string,
    convertSvg = true,
    skipOverride?: boolean,
    injectObject?: OverridesOptions,
    timestampPathsConfig?: TimestampPathsConfig,
    c?: RnvContext,
    extFilter?: Array<string>
) => {
    logDebug('copyFolderRecursiveSync', source, target);
    if (!fs.existsSync(source)) return;

    let files = [];
    // check if folder needs to be created or integrated
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        mkdirSync(targetFolder);
    }
    // copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach((file) => {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(
                    curSource,
                    targetFolder,
                    convertSvg,
                    skipOverride,
                    injectObject,
                    timestampPathsConfig,
                    c,
                    extFilter
                );
            } else if (path.extname(curSource) === '.svg' && convertSvg === true) {
                const jsDest = path.join(targetFolder, `${path.basename(curSource)}.js`);
                logDebug(`file ${curSource} is svg and convertSvg is set to true. converting to ${jsDest}`);
                saveAsJs(curSource, jsDest);
            } else if (injectObject !== null) {
                copyFileWithInjectSync(curSource, targetFolder, skipOverride, injectObject, timestampPathsConfig, c);
            } else if (extFilter && extFilter?.length > 0) {
                if (extFilter.includes(path.extname(curSource)) || extFilter.includes(path.basename(curSource))) {
                    copyFileSync(curSource, targetFolder, skipOverride, timestampPathsConfig);
                }
            } else {
                copyFileSync(curSource, targetFolder, skipOverride, timestampPathsConfig);
            }
        });
    }
};

export const copyFolderContentsRecursiveSync = (
    source: string | null | undefined,
    target: string | null | undefined,
    convertSvg = true,
    skipPaths?: Array<string>,
    skipOverride?: boolean,
    injectObject?: OverridesOptions,
    timestampPathsConfig?: TimestampPathsConfig,
    c?: RnvContext,
    extFilter?: Array<string>
) => {
    logDebug('copyFolderContentsRecursiveSync', source, target, skipPaths);
    if (!source || !target) return;
    if (!fs.existsSync(source)) return;
    let files = [];
    const targetFolder = path.join(target);
    if (!fs.existsSync(targetFolder)) {
        mkdirSync(targetFolder);
    }
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach((file) => {
            const curSource = path.join(source, file);
            if (!skipPaths || (skipPaths && !skipPaths.includes(curSource))) {
                if (fs.lstatSync(curSource).isDirectory()) {
                    copyFolderRecursiveSync(
                        curSource,
                        targetFolder,
                        convertSvg,
                        skipOverride || false,
                        injectObject,
                        timestampPathsConfig,
                        c,
                        extFilter
                    );
                } else if (injectObject !== null) {
                    copyFileWithInjectSync(
                        curSource,
                        targetFolder,
                        skipOverride || false,
                        injectObject,
                        timestampPathsConfig,
                        c
                    );
                } else if (path.extname(curSource) === '.svg' && convertSvg === true) {
                    const jsDest = path.join(targetFolder, `${path.basename(curSource)}.js`);
                    logDebug(`file ${curSource} is svg and convertSvg is set to true. converting to ${jsDest}`);
                    saveAsJs(curSource, jsDest);
                } else if (extFilter && extFilter?.length > 0) {
                    if (extFilter.includes(path.extname(curSource)) || extFilter.includes(path.basename(curSource))) {
                        copyFileSync(curSource, targetFolder, skipOverride, timestampPathsConfig);
                    }
                } else {
                    copyFileSync(curSource, targetFolder, skipOverride, timestampPathsConfig);
                }
            }
        });
    }
};

export const copyFolderContentsRecursive = (source: string, target: string, convertSvg = true, skipPaths?: boolean) =>
    new Promise<void>((resolve, reject) => {
        logDebug('copyFolderContentsRecursive', source, target, skipPaths, convertSvg);
        if (!fs.existsSync(source)) return;
        const targetFolder = path.resolve(target);
        if (!fs.existsSync(targetFolder)) {
            mkdirSync(targetFolder);
        }
        ncp(source, targetFolder, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });

export const saveAsJs = (source: string, dest: string) => {
    Svg2Js.createSync({
        source,
        destination: dest,
    });
};

export const removeDir = (pth: string, callback: () => void) => {
    rimraf(pth, callback);
};

export const mkdirSync = (dir: string) => {
    if (!dir) return;
    if (fs.existsSync(dir)) return;
    try {
        shelljs.mkdir('-p', dir);
    } catch (e) {
        logWarning(`shelljs.mkdir failed for dir: ${dir} with error: ${e}`);
    }
};

export const cleanFolder = (d: string) =>
    new Promise<void>((resolve) => {
        logDebug('cleanFolder', d);
        removeDir(d, () => {
            mkdirSync(d);
            resolve();
        });
    });

export const removeFilesSync = (filePaths: Array<string>) => {
    logDebug('removeFilesSync', filePaths);
    filePaths.forEach((filePath) => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                logDebug(`Path ${filePath} does not exist`);
            }
        } catch (e: any) {
            logError(e);
        }
    });
};

export const removeDirsSync = (dirPaths: Array<string>) => {
    logDebug('removeDirsSync', dirPaths);

    for (let i = 0; i < dirPaths.length; i++) {
        try {
            removeDirSync(dirPaths[i]);
        } catch (e: any) {
            logError(e);
        }
    }
};

export const removeDirs = (dirPaths: Array<string>) =>
    new Promise<void>((resolve) => {
        logDebug('removeDirs', dirPaths);
        const allFolders = dirPaths.length;
        let deletedFolders = 0;
        for (let i = 0; i < allFolders; i++) {
            rimraf(dirPaths[i], (e: string | Error) => {
                if (e) {
                    logError(e);
                }
                deletedFolders++;
                if (deletedFolders >= allFolders) resolve();
            });
        }
        if (allFolders === 0) resolve();
    });

export const removeDirSync = (_dir: string, _rmSelf?: boolean) => {
    let dir = _dir;
    let rmSelf = _rmSelf;
    let files;
    rmSelf = rmSelf === undefined ? true : rmSelf;
    dir += '/';
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        logDebug('!Oops, directory not exist.');
        return;
    }
    if (files.length > 0) {
        files.forEach((x) => {
            try {
                if (fs.statSync(dir + x).isDirectory()) {
                    removeDirSync(dir + x);
                } else {
                    fs.unlinkSync(dir + x);
                }
            } catch (e) {
                logDebug(`removeDirSync error:${e}. will try to unlink`);
                try {
                    fs.unlinkSync(dir + x);
                } catch (e2) {
                    logDebug(`removeDirSync error:${e}`);
                }
            }
        });
    }
    if (rmSelf) {
        // check if user want to delete the directory ir just the files in this directory
        fs.rmdirSync(dir);
    }
};

export const writeFileSync = (filePath: string | undefined, obj: string | object, spaces = 4, addNewLine = true) => {
    if (!filePath) return;
    logDebug('writeFileSync', filePath);
    if (filePath.includes('?') || filePath.includes('undefined')) return;
    let output;
    if (typeof obj === 'string') {
        output = obj;
    } else {
        output = `${JSON.stringify(obj, null, spaces)}${addNewLine ? '\n' : ''}`;
    }
    if (fs.existsSync(filePath)) {
        if (fs.readFileSync(filePath).toString() === output) return;
    }
    logDebug('writeFileSync', filePath, 'executed', `size:${output?.length}`);
    fsWriteFileSync(filePath, output);
    return output;
};

export const writeObjectSync = (filePath: string, obj: string | object, spaces: number, addNewLine = true) => {
    logDebug('writeObjectSync', filePath);
    logWarning('writeObjectSync is DEPRECATED. use writeFileSync instead');
    return writeFileSync(filePath, obj, spaces, addNewLine);
};

export const readObjectSync = (filePath?: string, sanitize?: boolean, c?: RnvContext) => {
    logDebug(`readObjectSync:${sanitize}:${filePath}`);
    if (!filePath) {
        logDebug('readObjectSync: filePath is undefined');
        return null;
    }
    if (!fs.existsSync(filePath)) {
        logDebug(`readObjectSync: File at ${filePath} does not exist`);
        return null;
    }
    let obj;
    try {
        obj = JSON.parse(fs.readFileSync(filePath).toString());
        if (sanitize) {
            logDebug(`readObjectSync: will sanitize file at: ${filePath}`);
            if (c) {
                obj = sanitizeDynamicRefs(c, obj);
            }
            if (obj._refs) {
                obj = sanitizeDynamicProps(obj, {
                    files: c?.files,
                    runtimeProps: c?.runtime,
                    props: obj._refs,
                    configProps: c?.configPropsInjects,
                });
            }
        }
    } catch (e) {
        logError(`readObjectSync: Parsing of ${chalk().white(filePath)} failed with ${e}`);
        return null;
    }
    return obj;
};

export const updateObjectSync = (filePath: string, updateObj: object) => {
    let output: object;
    const obj = readObjectSync(filePath);
    if (obj) {
        output = merge(obj, updateObj);
    } else {
        output = updateObj;
    }
    writeFileSync(filePath, output);
    return output;
};

export const getRealPath = (c: RnvContext, p: string | undefined, key = 'undefined', original?: string) => {
    if (!p) {
        if (original) {
            logDebug(`Path ${chalk().white(key)} is not defined. using default: ${chalk().white(original)}`);
        }
        return original;
    }
    if (p.startsWith('./')) {
        return path.join(c.paths.project.dir, p);
    }
    const output = p
        .replace(/\$RNV_HOME/g, c.paths.rnv.dir)
        .replace(/~/g, c.paths.home.dir)
        .replace(/\$USER_HOME/g, c.paths.home.dir)
        .replace(/\$PROJECT_HOME/g, c.paths.project.dir)
        .replace(/\$WORKSPACE_HOME/g, c.paths.workspace.dir)
        .replace(/RNV_HOME/g, c.paths.rnv.dir)
        .replace(/USER_HOME/g, c.paths.home.dir)
        .replace(/PROJECT_HOME/g, c.paths.project.dir);
    return output;
};

const _refToValue = (c: RnvContext, ref: string, key: string) => {
    const val = ref.replace('$REF$:', '').split('$...');

    const realPath = getRealPath(c, val[0], key);

    if (realPath && realPath.includes('.json') && val.length === 2) {
        if (fs.existsSync(realPath)) {
            const obj = readObjectSync(realPath);

            try {
                const output = val[1].split('.').reduce((o, i) => o[i], obj);
                return output;
            } catch (e) {
                logWarning(`_refToValue: ${e}`);
            }
        } else {
            logWarning(`_refToValue: ${chalk().white(realPath)} does not exist!`);
        }
    }
    return ref;
};

export const arrayMerge = (destinationArray: Array<string>, sourceArray: Array<string>) => {
    const jointArray = destinationArray.concat(sourceArray);
    const uniqueArray = jointArray.filter((item, index) => jointArray.indexOf(item) === index);
    return uniqueArray;
};

const _arrayMergeOverride = (_destinationArray: Array<string>, sourceArray: Array<string>) => sourceArray;

export const sanitizeDynamicRefs = (c: RnvContext, obj: any) => {
    if (!obj) return obj;
    if (Array.isArray(obj)) {
        obj.forEach((v) => {
            sanitizeDynamicRefs(c, v);
        });
        return obj;
    }
    Object.keys(obj).forEach((key) => {
        const val = obj[key];
        if (val) {
            if (typeof val === 'string') {
                if (val.startsWith('$REF$:')) {
                    obj[key] = _refToValue(c, val, key);
                }
            } else {
                sanitizeDynamicRefs(c, val);
            }
        }
    });
    return obj;
};

export const resolvePackage = (text: string) => {
    if (typeof text !== 'string') return text;
    const regEx = /{{resolvePackage\(([\s\S]*?)\)}}/g;
    const matches = text.match(regEx);
    let newText = text;
    if (matches?.length) {
        matches.forEach((match) => {
            const val = match.replace('{{resolvePackage(', '').replace(')}}', '');
            // TODO: Figure out WIN vs LINUX treatment here
            // forceForwardPaths is required for WIN Android to work correctly
            newText = newText.replace(match, global._doResolve(val, false, { forceForwardPaths: true }));
        });
    }
    return newText;
};

export const sanitizeDynamicProps = (obj: any, propConfig: FileUtilsPropConfig): any => {
    if (!obj) {
        return obj;
    }
    if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
            const val = v;
            if (typeof val === 'string') {
                _bindStringVals(obj, val, i, propConfig);
            } else {
                sanitizeDynamicProps(v, propConfig);
            }
        });
    } else if (typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
            const val = obj[key];
            // Some values are passed as keys so have to validate keys as well
            const newKey = resolvePackage(key);
            delete obj[key];
            obj[newKey] = val;
            if (val) {
                if (typeof val === 'string') {
                    _bindStringVals(obj, val, newKey, propConfig);
                } else {
                    sanitizeDynamicProps(val, propConfig);
                }
            }
        });
    } else if (typeof obj === 'string') {
        return resolvePackage(obj);
    }

    return obj;
};

const BIND_FILES = '{{files.';
const BIND_PROPS = '{{props.';
const BIND_CONFIG_PROPS = '{{configProps.';
const BIND_RUNTIME_PROPS = '{{runtimeProps.';
const BIND_ENV = '{{env.';

const _bindStringVals = (obj: any, _val: string, newKey: string | number, propConfig: FileUtilsPropConfig) => {
    const { props = {}, configProps = {}, runtimeProps = {} } = propConfig;
    let val = _val;
    if (val.includes(BIND_FILES)) {
        const key = val.replace(BIND_FILES, '').replace('}}', '');
        //TODO: this any not good
        const nVal: any = key.split('.').reduce((o, i) => o?.[i], propConfig.files);
        obj[newKey] = resolvePackage(nVal);
    } else if (val.includes(BIND_PROPS)) {
        Object.keys(props).forEach((pk) => {
            val = val.replace(`${BIND_PROPS}${pk}}}`, props?.[pk]);
            obj[newKey] = resolvePackage(val);
        });
    } else if (val.includes(BIND_CONFIG_PROPS)) {
        Object.keys(configProps).forEach((pk2) => {
            val = val.replace(`${BIND_CONFIG_PROPS}${pk2}}}`, configProps[pk2]);
            obj[newKey] = resolvePackage(val);
        });
    } else if (val.includes(BIND_RUNTIME_PROPS)) {
        Object.keys(runtimeProps).forEach((pk3) => {
            val = val.replace(`${BIND_RUNTIME_PROPS}${pk3}}}`, runtimeProps[pk3]);
            obj[newKey] = resolvePackage(val);
        });
    } else if (val.includes(BIND_ENV)) {
        const key = val.replace(BIND_ENV, '').replace('}}', '');
        obj[newKey] = process.env[key];
    }
};

export const mergeObjects = (c: RnvContext, obj1: any, obj2: any, dynamicRefs = true, replaceArrays = false) => {
    if (!obj2) return obj1;
    if (!obj1) return obj2;
    const obj = merge(obj1, obj2, {
        arrayMerge: replaceArrays ? _arrayMergeOverride : arrayMerge,
    });
    return dynamicRefs ? sanitizeDynamicRefs(c, obj) : obj;
};

export const updateConfigFile = async (update: FileUtilsUpdateConfig, globalConfigPath: string) => {
    const configContents = JSON.parse(fs.readFileSync(globalConfigPath).toString());

    if (update.androidSdk) {
        configContents.sdks.ANDROID_SDK = update.androidSdk;
    }

    if (update.tizenSdk) {
        configContents.sdks.TIZEN_SDK = update.tizenSdk;
    }

    if (update.webosSdk) {
        configContents.sdks.WEBOS_SDK = update.webosSdk;
    }

    logDebug(`Updating ${globalConfigPath}. New file ${JSON.stringify(configContents, null, 3)}`);

    fsWriteFileSync(globalConfigPath, JSON.stringify(configContents, null, 3));
};

export const replaceHomeFolder = (p: string) => {
    if (global._isSystemWin) return p.replace('~', process.env.USERPROFILE || '');
    return p.replace('~', process.env.HOME || '');
};

export const getFileListSync = (dir: fs.PathLike) => {
    let results: Array<string> = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fileFixed = `${dir}/${file}`;
        const stat = fs.statSync(fileFixed);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(getFileListSync(fileFixed));
        } else {
            /* Is a file */
            results.push(fileFixed);
        }
    });
    return results;
};

export const loadFile = (fileObj: any, pathObj: Record<string, any>, key: string) => {
    const pKey = `${key}Exists`;
    const pth = pathObj[key];

    if (typeof pth === 'string' && !fsExistsSync(pth)) {
        pathObj[pKey] = false;
        logDebug(`WARNING: loadFile: Path ${pathObj[key]} does not exists!`);
        logDebug(`FILE_EXISTS: ${key}:false path:${pathObj[key]}`);
        return false;
    }
    pathObj[pKey] = true;
    try {
        if (typeof pth === 'string') {
            const fileString = fsReadFileSync(pth).toString();
            fileObj[key] = JSON.parse(fileString);
            pathObj[pKey] = true;
            logDebug(`FILE_EXISTS: ${key}:true size:${formatBytes(Buffer.byteLength(fileString, 'utf8'))}`);
            // if (validateRuntimeObjectSchema && fileObj[key]) {
            //     const valid = ajv.validate(schemaRoot, fileObj[key]);
            //     if (!valid) {
            //         logWarning(`Invalid schema in ${pathObj[key]}. ISSUES: ${JSON.stringify(ajv.errors, null, 2)}`);
            //     }
            // }
            // if (pathObj[key].includes?.('renative.json')) {
            //     console.log(`FILE_EXISTS: ${key}:true size:${formatBytes(Buffer.byteLength(fileString, 'utf8'))}`);
            // }
        }

        return fileObj[key];
    } catch (e) {
        logError(`loadFile: ${pathObj[key]} :: ${e}`, true); // crash if there's an error in the config file
        return false;
    }
};

export const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

// Return all directories within a directory
export const getDirectories = (source: string) =>
    fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

export const cleanEmptyFoldersRecursively = (folder: string) => {
    const isDir = fsStatSync(folder).isDirectory();
    if (!isDir) {
        return;
    }
    let files = fsReaddirSync(folder);
    if (files.length > 0) {
        files.forEach((file) => {
            const fullPath = path.join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
        });

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = fsReaddirSync(folder);
    }

    if (files.length === 0) {
        fs.rmdirSync(folder);
    }
};

export default {
    sanitizeDynamicRefs,
    getFileListSync,
    removeDirs,
    copyFileSync,
    copyFolderRecursiveSync,
    removeDir,
    removeDirsSync,
    removeFilesSync,
    saveAsJs,
    mkdirSync,
    copyFolderContentsRecursive,
    copyFolderContentsRecursiveSync,
    cleanFolder,
    writeFileSync,
    readObjectSync,
    updateObjectSync,
    arrayMerge,
    mergeObjects,
    updateConfigFile,
    replaceHomeFolder,
    getDirectories,
    resolvePackage,
    cleanEmptyFoldersRecursively,
};
