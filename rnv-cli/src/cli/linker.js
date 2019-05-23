import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import {
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
} from '../common';
import {
    IOS,
    TVOS,
    ANDROID,
    WEB,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBBOS_ARES_INSTALL,
    CLI_WEBBOS_ARES_LAUNCH,
} from '../constants';
import { executeAsync, execCLI } from '../exec';
import { runXcodeProject } from '../platformTools/apple';
import { buildWeb, runWeb } from '../platformTools/web';
import { runTizen } from '../platformTools/tizen';
import { runWebOS } from '../platformTools/webos';
import { runFirefoxProject } from '../platformTools/firefox';
import { runElectron } from '../platformTools/electron';
import { packageAndroid, runAndroid, configureAndroidProperties, configureGradleProject } from '../platformTools/android';
import appRunner, { copyRuntimeAssets } from './app';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const LINK = 'link';

// ##########################################
// PUBLIC API
// ##########################################

const run = c => {
    logTask('run');

    switch (c.command) {
        case LINK:
            return _link(c);
            break;
        default:
            return Promise.reject(`Command ${c.command} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _link = c =>
    new Promise((resolve, reject) => {
        if (fs.existsSync(c.projectNpmLinkPolyfillPath)) {
            const l = JSON.parse(fs.readFileSync(c.projectNpmLinkPolyfillPath).toString());
            for (const key in l) {
                // console.log('COPY', key, l[key]);
                const source = path.resolve(l[key]);
                const nm = path.join(source, 'node_modules');
                const dest = path.join(c.nodeModulesFolder, key);
                if (fs.existsSync(source)) {
                    copyFolderContentsRecursiveSync(source, dest, false, [nm]);
                } else {
                    logWarning(`Source: ${source} doesn't exists!`);
                }
            }
        } else {
            logWarning(`${c.projectNpmLinkPolyfillPath} file not found. nothing to link!`);
            resolve();
        }
    });

export default run;
