import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
    isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logDebug, logErrorPlatform,
} from '../common';
import {
    IOS, TVOS, ANDROID, WEB, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, MACOS, WINDOWS,
    RNV_PROJECT_CONFIG_NAME, RNV_GLOBAL_CONFIG_NAME,
} from '../constants';
import { executeAsync } from '../exec';
import { buildWeb } from '../platformTools/web';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const INIT = 'init';
const BOOTSTRAP = 'bootstrap';

const run = c => new Promise((resolve, reject) => {
    logTask('setup');

    switch (c.command) {
    case BOOTSTRAP:
        _runBootstrap().then(() => resolve()).catch(e => reject(e));
        break;
    case INIT:
        _runInit(c).then(() => resolve()).catch(e => reject(e));
        break;

    default:
        return Promise.reject(`Command ${c.command} not supported`);
    }
});

const _runInit = c => new Promise((resolve, reject) => {
    logTask('_runInit');

    if (fs.existsSync(c.globalConfigFolder)) {
        console.log('.rnv folder exists!');
    } else {
        console.log('.rnv folder missing! Creating one for you...');
        mkdirSync(c.globalConfigFolder);
    }

    if (fs.existsSync(c.globalConfigPath)) {
        console.log(`.rnv/${RNV_GLOBAL_CONFIG_NAME} folder exists!`);
    } else {
        console.log(`.rnv/${RNV_GLOBAL_CONFIG_NAME} file missing! Creating one for you...`);
        copyFileSync(path.join(c.rnvFolder, 'supportFiles', RNV_GLOBAL_CONFIG_NAME), c.globalConfigPath);
        console.log(`Don\'t forget to Edit: .rnv/${RNV_GLOBAL_CONFIG_NAME} with correct paths to your SDKs before continuing!`);
    }

    resolve();
});

const _runBootstrap = c => new Promise((resolve, reject) => {
    logTask('_runBootstrap');

    const rnvFolder = path.join(__dirname, '../..');
    const base = path.resolve('.');

    copyFileSync(path.join(rnvFolder, 'supportFiles/projectConfigs', RNV_PROJECT_CONFIG_NAME),
        path.join(base, RNV_PROJECT_CONFIG_NAME));

    resolve();
});


export default run;
