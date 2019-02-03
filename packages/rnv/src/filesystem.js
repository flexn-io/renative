import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import Svg2Js from 'svg2js';

const copyFileSync = (source, target) => {
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

const copyFolderRecursiveSync = (source, target, convertSvg = true) => {
    if (!fs.existsSync(source)) return;

    let files = [];
    // check if folder needs to be created or integrated
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        mkdirp(targetFolder);
    }
    // copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach((file) => {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else if (path.extname(curSource) === '.svg' && convertSvg === true) {
                saveAsJs(curSource, path.join(targetFolder, `${path.basename(curSource)}.js`));
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
};

const copyFolderContentsRecursiveSync = (source, target) => {
    if (!fs.existsSync(source)) return;
    let files = [];
    const targetFolder = path.join(target);
    if (!fs.existsSync(targetFolder)) {
        mkdirp(targetFolder);
    }
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach((file) => {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
};

const saveAsJs = (source, dest) => {
    Svg2Js.create({
        source,
        destination: dest,
    }).then(() => { console.log('The file was saved!'); });
};

const removeDir = (path, callback) => {
    rimraf(path, callback);
};

const mkdirp = (dir) => {
    // we explicitly don't use `path.sep` to have it platform independent;
    const sep = '/';
    const segments = dir.split(sep);
    let current = '';
    let i = 0;

    while (i < segments.length) {
        current = current + sep + segments[i];
        try {
            fs.statSync(current);
        } catch (e) {
            fs.mkdirSync(current);
        }

        i++;
    }
};

const cleanFolder = d => new Promise((resolve, reject) => {
    removeDir(d, () => {
        mkdirp(d);
        console.log('Clean folder', d);
        resolve();
    });
});

export { copyFileSync, copyFolderRecursiveSync, removeDir, saveAsJs, mkdirp, copyFolderContentsRecursiveSync, cleanFolder };
