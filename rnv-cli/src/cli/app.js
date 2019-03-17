import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    isPlatformSupported, getConfig, logTask, logComplete, getQuestion, logSuccess,
    logError, getAppFolder, isPlatformActive, logWarning, configureIfRequired,
} from '../common';
import {
    IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, WEB, MACOS,
    WINDOWS, TIZEN_WATCH, KAIOS, RNV_APP_CONFIG_NAME, SAMPLE_APP_ID, RNV_PROJECT_CONFIG_NAME,
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
    const p = c.program.platform || 'all';
    logTask(`_runConfigure:${p}`);


    _checkAndCreatePlatforms(c)
        .then(() => copyRuntimeAssets(c))
        .then(() => _runPlugins(c))
        .then(() => (_isOK(c, p, [ANDROID, ANDROID_TV, ANDROID_WEAR]) ? configureAndroidProperties(c) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID]) ? configureGradleProject(c, ANDROID) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_TV]) ? configureGradleProject(c, ANDROID_TV) : Promise.resolve()))
        .then(() => (_isOK(c, p, [ANDROID_WEAR]) ? configureGradleProject(c, ANDROID_WEAR) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN]) ? configureTizenProject(c, TIZEN) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TIZEN_WATCH]) ? configureTizenProject(c, TIZEN_WATCH) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WEBOS]) ? configureWebOSProject(c, WEBOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WEB]) ? configureWebProject(c, WEB) : Promise.resolve()))
        .then(() => (_isOK(c, p, [MACOS]) ? configureElectronProject(c, MACOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [WINDOWS]) ? configureElectronProject(c, WINDOWS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [KAIOS]) ? configureKaiOSProject(c, KAIOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [IOS]) ? configureXcodeProject(c, IOS) : Promise.resolve()))
        .then(() => (_isOK(c, p, [TVOS]) ? configureXcodeProject(c, TVOS) : Promise.resolve()))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _isOK = (c, p, list) => {
    let result = false;
    list.forEach((v) => {
        if (isPlatformActive(c, v) && (p === v || p === 'all')) result = true;
    });
    return result;
};

const _runCreate = c => new Promise((resolve, reject) => {
    logTask('_runCreate');

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const data = {};

    readline.question(getQuestion('What\'s your project ID? (no spaces, folder based on ID will be created in this directory)'), (v) => {
        // console.log(`Hi ${v}!`);
        data.appID = v;
        readline.question(getQuestion('What\'s your project Title?'), (v) => {
            // console.log(`Hi ${v}!`);
            data.appTitle = v;
            readline.close();

            const base = path.resolve('.');

            c.projectRootFolder = path.join(base, data.appID);
            c.projectPackagePath = path.join(c.projectRootFolder, 'package.json');


            const pkgName = data.appTitle.replace(/\s+/g, '-').toLowerCase();

            mkdirSync(c.projectRootFolder);

            checkAndCreateProjectPackage(c, pkgName, data.appTitle);

            checkAndCreateGitignore(c);

            checkAndCreateProjectConfig(c);

            logSuccess(`Your project is ready! navigate to project ${chalk.bold.white(`cd ${data.appID}`)} and run ${chalk.bold.white('rnv run -p web')} to see magic happen!`);

            resolve();
        });
    });
});

const checkAndCreateProjectPackage = (c, pkgName, appTitle) => {
    logTask(`checkAndCreateProjectPackage:${pkgName}`);
    if (!fs.existsSync(c.projectPackagePath)) {
        logWarning('Looks like your package.json is missing. Let\'s create one for you!');

        const pkgJsonString = fs.readFileSync(path.join(c.rnvHomeFolder, 'supportFiles/package-template.json')).toString();


        const pkgJsonStringClean = pkgJsonString
            .replace(/{{PACKAGE_NAME}}/g, pkgName)
            .replace(/{{RNV_VERSION}}/g, c.rnvPackage.version)
            .replace(/{{PACKAGE_VERSION}}/g, '0.1.0')
            .replace(/{{PACKAGE_TITLE}}/g, appTitle);

        fs.writeFileSync(c.projectPackagePath, pkgJsonStringClean);
    }
};

const checkAndCreateGitignore = (c) => {
    logTask('checkAndCreateGitignore');
    const ignrPath = path.join(c.projectRootFolder, '.gitignore');
    if (!fs.existsSync(ignrPath)) {
        logWarning('Looks like your .gitignore is missing. Let\'s create one for you!');

        copyFileSync(path.join(c.rnvHomeFolder, 'supportFiles/gitignore-template'), ignrPath);
    }
};

const checkAndCreateProjectConfig = (c) => {
    // Check Project Config
    if (fs.existsSync(c.projectConfigPath)) {

    } else {
        logWarning(`You're missing ${RNV_PROJECT_CONFIG_NAME} file in your root project! Let's create one!`);

        copyFileSync(path.join(c.rnvRootFolder, RNV_PROJECT_CONFIG_NAME),
            path.join(c.projectRootFolder, RNV_PROJECT_CONFIG_NAME));
    }
};


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

    copyFileSync(path.resolve(c.platformTemplatesFolder, '_shared/template.js'), path.resolve(c.platformBuildsFolder, '_shared/template.js'));
    resolve();
});

export { copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore };

export default run;
