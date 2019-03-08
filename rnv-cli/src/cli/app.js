import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, isPlatformActive, logWarning, configureIfRequired,
} from '../common';
import {
    IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, WEB, MACOS,
    WINDOWS, TIZEN_WATCH, KAIOS, RNV_APP_CONFIG_NAME, SAMPLE_APP_ID,
} from '../constants';
import { runPod, copyAppleAssets, configureXcodeProject } from '../platformTools/apple';
import { configureGradleProject, configureAndroidProperties } from '../platformTools/android';
import { configureTizenProject, createDevelopTizenCertificate } from '../platformTools/tizen';
import { configureWebOSProject } from '../platformTools/webos';
import { configureElectronProject } from '../platformTools/electron';
import { configureKaiOSProject } from '../platformTools/kaios';
import { configureWebProject } from '../platformTools/web';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import platformRunner from './platform';

const CONFIGURE = 'configure';
const SWITCH = 'switch';
const CREATE = 'create';
const REMOVE = 'remove';
const LIST = 'list';
const INFO = 'info';

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case CONFIGURE:
        return _runConfigure(c);
        break;
    case CREATE:
        return _runCreate(c);
        break;
    // case SWITCH:
    //     return Promise.resolve();
    //     break;
    //
    // case REMOVE:
    //     return Promise.resolve();
    //     break;
    // case LIST:
    //     return Promise.resolve();
    //     break;
    // case INFO:
    //     return Promise.resolve();
    //     break;
    default:
        return Promise.reject(`Sub-Command ${c.subCommand} not supported`);
    }
};

// ##########################################
//  PRIVATE
// ##########################################

const _runConfigure = c => new Promise((resolve, reject) => {
    logTask('_runConfigure');


    _checkAndCreatePlatforms(c)
        .then(() => copyRuntimeAssets(c))
        .then(() => _runPlugins(c))
        .then(() => configureAndroidProperties(c))
        .then(() => configureGradleProject(c, ANDROID))
        .then(() => configureGradleProject(c, ANDROID_TV))
        .then(() => configureGradleProject(c, ANDROID_WEAR))
        .then(() => configureTizenProject(c, TIZEN))
        .then(() => configureTizenProject(c, TIZEN_WATCH))
        .then(() => configureWebOSProject(c, WEBOS))
        .then(() => configureWebProject(c, WEB))
        .then(() => configureElectronProject(c, MACOS))
        .then(() => configureElectronProject(c, WINDOWS))
        .then(() => configureKaiOSProject(c, KAIOS))
        .then(() => configureXcodeProject(c, IOS, 'RNVApp'))
        .then(() => configureXcodeProject(c, TVOS, 'RNVAppTVOS'))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runCreate = c => new Promise((resolve, reject) => {
    logTask('_runCreate');

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const data = {};

    readline.question('What\'s your project ID? (no spaces, folder based on ID will be created in this directory): ', (v) => {
        // console.log(`Hi ${v}!`);
        data.appID = v;
        readline.question('What\'s your project Title?: ', (v) => {
            // console.log(`Hi ${v}!`);
            data.appTitle = v;
            readline.close();

            const base = path.resolve('.');

            data.projectDir = path.join(base, data.appID);


            const pkgJsonString = fs.readFileSync(path.join(c.rnvHomeFolder, 'supportFiles/package-template.json')).toString();

            const pkgName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

            const pkgJsonStringClean = pkgJsonString
                .replace(/{{PACKAGE_NAME}}/g, pkgName)
                .replace(/{{RNV_VERSION}}/g, '0.12.0-alpha8')
                .replace(/{{PACKAGE_VERSION}}/g, '0.1.0')
                .replace(/{{PACKAGE_TITLE}}/g, data.appTitle);

            mkdirSync(data.projectDir);

            fs.writeFileSync(path.join(data.projectDir, 'package.json'), pkgJsonStringClean);

            logTask(`Your project is ready! navigate to project ${chalk.bold.white(`cd ${data.appID}`)} and run ${chalk.bold.white('rnv run -p web')} to see magic happen!`);

            resolve();
        });
    });
});


const _checkAndCreatePlatforms = c => new Promise((resolve, reject) => {
    logTask('_checkAndCreatePlatforms');

    if (!fs.existsSync(c.platformBuildsFolder)) {
        logWarning('Platforms not created yet. creating them for you...');

        const newCommand = Object.assign({}, c);
        newCommand.subCommand = 'configure';
        newCommand.program = { appConfig: SAMPLE_APP_ID };

        platformRunner(newCommand)
            .then(() => resolve())
            .catch(e => reject(e));

        return;
    }
    resolve();
});

const copyRuntimeAssets = c => new Promise((resolve, reject) => {
    logTask('copyRuntimeAssets');
    const aPath = path.join(c.platformAssetsFolder, 'runtime');
    const cPath = path.join(c.appConfigFolder, 'assets/runtime');
    copyFolderContentsRecursiveSync(cPath, aPath);

    copyFileSync(c.appConfigPath, path.join(c.platformAssetsFolder, RNV_APP_CONFIG_NAME));
    resolve();
});


const _runPlugins = c => new Promise((resolve, reject) => {
    logTask('_runPlugins');

    const pluginsPath = path.resolve(c.rnvHomeFolder, 'plugins');

    fs.readdirSync(pluginsPath).forEach((dir) => {
        const pp = path.resolve(pluginsPath, dir, 'overrides');
        fs.readdirSync(pp).forEach((file) => {
            copyFileSync(path.resolve(pp, file), path.resolve(c.projectRootFolder, 'node_modules', dir));
        });
    });

    mkdirSync(path.resolve(c.platformBuildsFolder, '_shared'));

    copyFileSync(path.resolve(c.rnvHomeFolder, 'supportFiles/template.js'), path.resolve(c.platformBuildsFolder, '_shared/template.js'));
    resolve();
});

export { copyRuntimeAssets };

export default run;
