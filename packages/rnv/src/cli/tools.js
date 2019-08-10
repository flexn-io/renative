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
import { logStatus } from '../systemTools/logger';
import { fixPackageJson } from '../systemTools/doctor';
import { encrypt, decrypt, installProfiles, updateProfiles, installCerts } from '../systemTools/crypto';
import { updateProfile } from '../platformTools/apple/fastlane';
import { executePipe } from '../projectTools/buildHooks';
import {
    packageAndroid,
    runAndroid,
    configureGradleProject,
    buildAndroid,
    runAndroidLog,
} from '../platformTools/android';
import appRunner, { copyRuntimeAssets } from './app';

// COMMANDS
const FIX = 'fix';
const CLEAN = 'clean';
const STATUS = 'status';
const CRYPTO = 'crypto';

// SUB_COMMANDS
const FIX_PACKAGE = 'fixPackage';
const ENCRYPT = 'encrypt';
const DECRYPT = 'decrypt';
const INSTALL_PROFILES = 'installProfiles';
const UPDATE_PROFILES = 'updateProfiles';
const UPDATE_PROFILE = 'updateProfile';
const INSTALL_CERTS = 'installCerts';

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
    case STATUS:
        return _status(c);
    case CRYPTO:
        return _crypto(c);
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

const _crypto = c => new Promise((resolve, reject) => {
    switch (c.subCommand) {
    case ENCRYPT:
        encrypt(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case DECRYPT:
        decrypt(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case INSTALL_PROFILES:
        installProfiles(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case UPDATE_PROFILES:
        updateProfiles(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case UPDATE_PROFILE:
        updateProfile(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case INSTALL_CERTS:
        installCerts(c)
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    }

    reject(`Command ${c.command} ${c.subCommand} not supported`);
});

const _status = c => new Promise((resolve, reject) => {
    logStatus();
    resolve();
});

export { PIPES };

export default run;
