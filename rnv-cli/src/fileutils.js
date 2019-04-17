import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import Svg2Js from 'svg2js';
import shelljs from 'shelljs';
import { logDebug } from './common';

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

export { copyFileSync, copyFolderRecursiveSync, removeDir, saveAsJs, mkdirSync, copyFolderContentsRecursiveSync, cleanFolder };

export default {
    copyFileSync, copyFolderRecursiveSync, removeDir, saveAsJs, mkdirSync, copyFolderContentsRecursiveSync, cleanFolder,
};
