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
import { executeAsync, execCLI } from '../systemTools/exec';
import { cleanProjectModules } from '../systemTools/cleaner';
import { fixPackageJson } from '../systemTools/doctor';
import { executePipe } from '../projectTools/buildHooks';
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
const CLEAN = 'clean';
const FIX_PACKAGE = 'fixPackage';

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
    case CLEAN:
        return cleanProjectModules(c);
    }

    switch (c.subCommand) {
    case FIX_PACKAGE:
        return fixPackageJson(c);
    }

    return Promise.reject(`Command ${c.command} ${c.subCommand} not supported`);
};

// ##########################################
// PRIVATE
// ##########################################

const _fix = c => new Promise((resolve, reject) => {
    cleanNodeModules(c).then(() => resolve()).catch(e => reject(e));
});

export { PIPES };

export default run;
