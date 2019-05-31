import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
    isPlatformSupported,
    cleanNodeModules,
    isBuildSchemeSupported,
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    checkSdk,
    logError,
    getAppFolder,
    logDebug,
    logErrorPlatform,
    isSdkInstalled,
    logWarning,
    configureIfRequired,
    cleanPlatformIfRequired,
} from '../common';
import { IOS } from '../constants';
import { executeAsync, execCLI } from '../exec';
import { executePipe } from '../buildHooks';
import {
    packageAndroid,
    runAndroid,
    configureAndroidProperties,
    configureGradleProject,
    buildAndroid,
    runAndroidLog,
} from '../platformTools/android';
import appRunner, { copyRuntimeAssets } from './app';

const FIX = 'fix';

const PIPES = {
    FIX_BEFORE: 'fix:before',
    FIX_AFTER: 'fix:after',
};

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.command) {
    case FIX:
        return _fix(c);

    default:
        return Promise.reject(`Command ${c.command} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _fix = c => new Promise((resolve, reject) => {
    cleanNodeModules(c).then(() => resolve()).catch(e => reject(e));
});

export { PIPES };

export default run;
