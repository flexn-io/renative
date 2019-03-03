import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
    IOS, TVOS, ANDROID, WEB, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, MACOS, WINDOWS,
    isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logDebug, logErrorPlatform,
} from '../common';
import { executeAsync } from '../exec';
import { buildWeb } from '../platformTools/web';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const INIT = 'init';
const SETUP = 'setup';

const run = c => new Promise((resolve, reject) => {
    logTask('setup');

    switch (c.command) {
    case INIT:
        return _runInit(c).then(() => resolve()).catch(e => reject(e));
        break;
    // case SETUP:
    //     return _runSetup(c);
    //     break;
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
        console.log('.rnv/config.json folder exists!');
    } else {
        console.log('.rnv/config.json file missing! Creating one for you...');
        copyFileSync(path.join(c.rnvFolder, 'supportFiles/config.json'), c.globalConfigPath);
        console.log('Don\'t forget to Edit: .rnv/config.json with correct paths to your SDKs before continuing!');
    }

    resolve();
});


export default run;
