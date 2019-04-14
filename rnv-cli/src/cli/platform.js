import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import {
    IOS, ANDROID, TVOS, isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logInfo, getQuestion, logSuccess,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import AppCLI from './app';

const CONFIGURE = 'configure';
const UPDATE = 'update';
const LIST = 'list';
const ADD = 'add';
const REMOVE = 'remove';
const EJECT = 'eject';
const CONNECT = 'connect';

const PIPES = {
    PLATFORM_CONFIGURE_BEFORE: 'platform:configure:before',
    PLATFORM_CONFIGURE_AFTER: 'platform:configure:after',
    PLATFORM_UPDATE_BEFORE: 'platform:update:before',
    PLATFORM_UPDATE_AFTER: 'platform:update:after',
    PLATFORM_LIST_BEFORE: 'platform:list:before',
    PLATFORM_LIST_AFTER: 'platform:list:after',
    PLATFORM_ADD_BEFORE: 'platform:add:before',
    PLATFORM_ADD_AFTER: 'platform:add:after',
    PLATFORM_REMOVE_BEFORE: 'platform:remove:before',
    PLATFORM_REMOVE_AFTER: 'platform:remove:after',
    PLATFORM_EJECT_BEFORE: 'platform:eject:before',
    PLATFORM_EJECT_AFTER: 'platform:ejecct:after',
    PLATFORM_CONNECT_BEFORE: 'platform:connect:before',
    PLATFORM_CONNECT_AFTER: 'platform:connect:after',
};

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case CONFIGURE:
        return _runCreatePlatforms(c);
        break;
    case EJECT:
        return _runEjectPlatforms(c);
        break;
    case CONNECT:
        return _runConnectPlatforms(c);
        break;
    // case UPDATE:
    //     return Promise.resolve();
    //     break;
    // case LIST:
    //     return Promise.resolve();
    //     break;
    // case ADD:
    //     return Promise.resolve();
    //     break;
    // case REMOVE:
    //     return Promise.resolve();
    //     break;
    default:
        return Promise.reject(`Sub-Command ${c.subCommand} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _runCreatePlatforms = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`_runCreatePlatforms:${p}`);

    cleanPlaformBuild(c, p)
        .then(() => _runCleanPlaformAssets(c))
        .then(() => _runCopyPlatforms(c, p))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _runEjectPlatforms = c => new Promise((resolve, reject) => {
    logTask('_runEjectPlatforms');

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question(getQuestion('This will copy platformTemplates folder from RNV managed directly to your project. Type (y) to confirm'), (v) => {
        // console.log(`Hi ${v}!`);
        if (v.toLowerCase() === 'y') {
            const ptfn = 'platformTemplates';

            copyFolderContentsRecursiveSync(c.rnvPlatformTemplatesFolder, path.join(c.projectRootFolder, ptfn));

            c.projectConfig.platformTemplatesFolder = `./${ptfn}`;

            fs.writeFileSync(c.projectConfigPath, JSON.stringify(c.projectConfig, null, 2));

            logSuccess(`Your platform templates are located in ${chalk.white(c.projectConfig.platformTemplatesFolder)} now. You can edit them directly!`);

            resolve();

            // const newCommand = Object.assign({}, c);
            // newCommand.command = 'app';
            // newCommand.subCommand = 'configure';
            // AppCLI(newCommand).then(() => resolve()).catch(e => reject(e));
        } else {
            resolve();
        }
    });
});

const _runConnectPlatforms = c => new Promise((resolve, reject) => {
    logTask('_runConnectPlatforms');

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question(getQuestion('This will point platformTemplates folder from your local project to RNV managed one. Type (y) to confirm'), (v) => {
        // console.log(`Hi ${v}!`);
        if (v.toLowerCase() === 'y') {
            const ptfn = 'platformTemplates';

            c.projectConfig.platformTemplatesFolder = `RNV_HOME/${ptfn}`;

            fs.writeFileSync(c.projectConfigPath, JSON.stringify(c.projectConfig, null, 2));

            logSuccess(`You're now using RNV platformTemplates located in ${chalk.white(c.rnvPlatformTemplatesFolder)} now!`);

            resolve();
        } else {
            resolve();
        }
    });
});

const _addPlatform = (platform, program, process) => new Promise((resolve, reject) => {
    if (!isPlatformSupported(platform, resolve)) return;

    getConfig().then((v) => {
        _runAddPlatform()
            .then(() => resolve())
            .catch(e => reject(e));
    });
});

const _removePlatform = (platform, program, process) => new Promise((resolve, reject) => {
    if (!isPlatformSupported(platform, resolve)) return;
    console.log('REMOVE_PLATFORM: ', platform);
    resolve();
});

const _runCleanPlaformAssets = c => new Promise((resolve, reject) => {
    logTask('_runCleanPlaformAssets');

    cleanFolder(c.platformAssetsFolder).then(() => {
        resolve();
    });
});

const _runCopyPlatforms = (c, platform) => new Promise((resolve, reject) => {
    logTask('_runCopyPlatforms');
    const copyPlatformTasks = [];
    if (platform === 'all') {
        for (const k in c.appConfigFile.platforms) {
            if (isPlatformSupported(k)) {
                const ptPath = path.join(c.platformTemplatesFolder, `${k}`);
                const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
                copyPlatformTasks.push(copyFolderContentsRecursiveSync(ptPath, pPath));
            }
        }
    } else if (isPlatformSupported(platform)) {
        const ptPath = path.join(c.platformTemplatesFolder, `${platform}`);
        const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${platform}`);
        copyPlatformTasks.push(copyFolderContentsRecursiveSync(ptPath, pPath));
    }

    Promise.all(copyPlatformTasks).then((values) => {
        resolve();
    });
});

const cleanPlaformBuild = (c, platform) => new Promise((resolve, reject) => {
    logTask('cleanPlaformBuild');

    const cleanTasks = [];

    if (platform === 'all') {
        for (const k in c.appConfigFile.platforms) {
            if (isPlatformSupported(k)) {
                const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
                cleanTasks.push(cleanFolder(pPath));
            }
        }
    } else if (isPlatformSupported(platform)) {
        const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${platform}`);
        cleanTasks.push(cleanFolder(pPath));
    }

    Promise.all(cleanTasks).then((values) => {
        resolve();
    });
});

const _runAddPlatform = c => new Promise((resolve, reject) => {
    logTask('runAddPlatform');
    resolve();
});

const createPlatformBuild = (c, platform) => new Promise((resolve, reject) => {
    logTask(`createPlatformBuild:${platform}`);

    if (!isPlatformSupported(platform, null, reject)) return;

    const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${platform}`);
    const ptPath = path.join(c.platformTemplatesFolder, `${platform}`);
    copyFolderContentsRecursiveSync(ptPath, pPath);

    resolve();
});

export { createPlatformBuild, cleanPlaformBuild, PIPES };

export default run;
