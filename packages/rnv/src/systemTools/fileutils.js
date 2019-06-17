import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import Svg2Js from 'svg2js';
import shelljs from 'shelljs';
import merge from 'deepmerge';
import { logDebug, logError } from '../common';

const copyFileSync = (source, target) => {
    logDebug('copyFileSync', source, target);
    let targetFile = target;
    // if target is a directory a new file with the same name will be created
    if (source.indexOf('.DS_Store') !== -1) return;

    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
};

const copyFolderRecursiveSync = (source, target, convertSvg = true, skipPaths) => {
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
                copyFolderRecursiveSync(curSource, targetFolder);
            } else if (path.extname(curSource) === '.svg' && convertSvg === true) {
                const jsDest = path.join(targetFolder, `${path.basename(curSource)}.js`);
                logDebug(`file ${curSource} is svg and convertSvg is set to true. converitng to ${jsDest}`);
                saveAsJs(curSource, jsDest);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
};

const copyFolderContentsRecursiveSync = (source, target, convertSvg = true, skipPaths) => {
    logDebug('copyFolderContentsRecursiveSync', source, target, skipPaths);
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
                    copyFolderRecursiveSync(curSource, targetFolder, convertSvg, skipPaths);
                } else {
                    copyFileSync(curSource, targetFolder);
                }
            }
        });
    }
};

const saveAsJs = (source, dest) => {
    Svg2Js.createSync({
        source,
        destination: dest,
    });
};

const removeDir = (path, callback) => {
    rimraf(path, callback);
};

const mkdirSync = (dir) => {
    shelljs.mkdir('-p', dir);
};

const cleanFolder = d => new Promise((resolve, reject) => {
    logDebug('cleanFolder', d);
    removeDir(d, () => {
        mkdirSync(d);
        resolve();
    });
});

const removeFiles = filePaths => new Promise((resolve, reject) => {
    logDebug('removeFiles', filePaths);
    v.forEach((filePath) => {
        fs.unlinkSync(filePath);
    });
});

const removeDirs = dirPaths => new Promise((resolve, reject) => {
    logDebug('removeDirs', dirPaths);
    try {
        for (let i = 0; i < dirPaths.length; i++) {
            removeDirSync(dirPaths[i]);
        }
    } catch (e) {
        reject(e);
    }

    resolve();
});


const removeDirSync = (dir, rmSelf) => {
    let files;
    rmSelf = (rmSelf === undefined) ? true : rmSelf;
    dir += '/';
    try { files = fs.readdirSync(dir); } catch (e) { logDebug('!Oops, directory not exist.'); return; }
    if (files.length > 0) {
        files.forEach((x, i) => {
            if (fs.statSync(dir + x).isDirectory()) {
                removeDirSync(dir + x);
            } else {
                fs.unlinkSync(dir + x);
            }
        });
    }
    if (rmSelf) {
        // check if user want to delete the directory ir just the files in this directory
        fs.rmdirSync(dir);
    }
};

const writeObjectSync = (filePath, obj, spaces, addNewLine = true) => {
    if (addNewLine) {
        fs.writeFileSync(filePath, `${JSON.stringify(obj, null, spaces || 4)}\n`);
    } else {
        fs.writeFileSync(filePath, JSON.stringify(obj, null, spaces || 4));
    }
};

const readObjectSync = (filePath) => {
    if (!fs.existsSync(filePath)) {
        logError(`File at ${filePath} does not exist`);
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath));
};

const updateObjectSync = (filePath, updateObj) => {
    let output;
    const obj = readObjectSync(filePath);
    if (obj) {
        output = merge(obj, updateObj);
        writeObjectSync(filePath, output);
    }
    return output;
};

const arrayMerge = (destinationArray, sourceArray, mergeOptions) => {
    const jointArray = destinationArray.concat(sourceArray);
    const uniqueArray = jointArray.filter((item, index) => jointArray.indexOf(item) === index);
    return uniqueArray;
};

const mergeObjects = (obj1, obj2) => {
    if (!obj2) return obj1;
    if (!obj1) return obj2;
    return merge(obj1, obj2, { arrayMerge });
};

export {
    copyFileSync, copyFolderRecursiveSync, removeDir, saveAsJs, mkdirSync,
    copyFolderContentsRecursiveSync, cleanFolder, removeFiles, removeDirs,
    writeObjectSync, readObjectSync, updateObjectSync, arrayMerge, mergeObjects
};

export default {
    copyFileSync,
    copyFolderRecursiveSync,
    removeDir,
    removeFiles,
    saveAsJs,
    mkdirSync,
    copyFolderContentsRecursiveSync,
    cleanFolder,
    writeObjectSync,
    readObjectSync,
    updateObjectSync,
    arrayMerge,
    mergeObjects
};
