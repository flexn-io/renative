"use strict";
exports.__esModule = true;
exports.setPagesDir = setPagesDir;
exports.findPagesDir = findPagesDir;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let pagesDir = null;
const existsSync = f => {
    try {
        _fs.default.accessSync(f, _fs.default.constants.F_OK);
        return true;
    } catch (_) {
        return false;
    }
};

function setPagesDir(dir) {
    pagesDir = dir;
    console.log('set dir', pagesDir);
}

function findPagesDir(dir) {
    if (pagesDir) {
        console.log('return', pagesDir);
        return pagesDir;
    } // prioritize ./pages over ./src/pages
    let curDir = _path.default.join(dir, 'pages');
    if (existsSync(curDir)) {
        console.log('return', curDir);
        return curDir;
    }
    curDir = _path.default.join(dir, 'src/pages');
    if (existsSync(curDir)) {
        console.log('return', curDir);
        return curDir;
    } // Check one level up the tree to see if the pages directory might be there
    if (existsSync(_path.default.join(dir, '..', 'pages'))) {
        throw new Error('> No `pages` directory found. Did you mean to run `next` in the parent (`../`) directory?');
    }
    throw new Error("> Couldn't find a `pages` directory. Please create one under the project root");
}