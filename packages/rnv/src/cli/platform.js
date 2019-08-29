/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import chalk from 'chalk';
import path from 'path';
import inquirer from 'inquirer';
import {
    isPlatformSupportedSync,
    logTask,
    logSuccess
} from '../common';
import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
import { cleanFolder, copyFolderContentsRecursiveSync, writeObjectSync, removeDirs } from '../systemTools/fileutils';
import { executePipe } from '../projectTools/buildHooks';
import { cleanPlaformAssets } from '../projectTools/projectParser';
import { PLATFORMS } from '../constants';

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
    case EJECT:
        return _runEjectPlatforms(c);
    case CONNECT:
        return _runConnectPlatforms(c);
    case LIST:
        return _runListPlatforms(c);
        // case UPDATE:
        //     return Promise.resolve();
        //     break;
        // case ADD:
        //     return Promise.resolve();
        //     break;
        // case REMOVE:
        //     return Promise.resolve();
        //     break;


    default:
        return Promise.reject(`platform:${c.command} Sub-Command ${c.subCommand} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################


const _runListPlatforms = c => new Promise((resolve, reject) => {
    const opts = _genPlatOptions(c);
    console.log(`\n${opts.asString}`);
    resolve();
});

const _runCreatePlatforms = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`_runCreatePlatforms:${p}`);

    executePipe(c, PIPES.PLATFORM_CONFIGURE_BEFORE)
        .then(() => cleanPlatformBuild(c, p))
        .then(() => cleanPlaformAssets(c))
        .then(() => _runCopyPlatforms(c, p))
        .then(() => executePipe(c, PIPES.PLATFORM_CONFIGURE_AFTER))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _generatePlatformChoices = c => c.buildConfig.defaults.supportedPlatforms.map((platform) => {
    const isConnected = c.paths.project.platformTemplatesDirs[platform].includes(c.paths.rnv.platformTemplates.dir);
    return { name: `${platform} - ${isConnected ? chalk.green('(connected)') : chalk.yellow('(ejected)')}`, value: platform, isConnected };
});

const _runEjectPlatforms = async (c) => {
    logTask('_runEjectPlatforms');

    const { ejectedPlatforms } = await inquirer.prompt({
        name: 'ejectedPlatforms',
        message: 'This will copy platformTemplates folders from ReNative managed directly to your project Select platforms you would like to connect',
        type: 'checkbox',
        choices: _generatePlatformChoices(c).map(choice => ({ ...choice, disabled: !choice.isConnected }))
    });

    if (ejectedPlatforms.length) {
        const ptfn = 'platformTemplates';
        const rptf = c.paths.rnv.platformTemplates.dir;
        const prf = c.paths.project.dir;

        let copyShared = false;

        ejectedPlatforms.forEach((platform) => {
            if (PLATFORMS[platform].requiresSharedConfig) {
                copyShared = true;
            }

            copyFolderContentsRecursiveSync(path.join(rptf, platform), path.join(prf, ptfn, platform));

            if (copyShared) {
                copyFolderContentsRecursiveSync(path.join(rptf, '_shared'), path.join(prf, ptfn, '_shared'));
            }

            c.files.project.config.platformTemplatesDirs = c.files.project.config.platformTemplatesDirs || {};
            c.files.project.config.platformTemplatesDirs[platform] = `./${ptfn}`;

            writeObjectSync(c.paths.project.config, c.files.project.config);
        });
    }

    logSuccess(
        `${chalk.white(ejectedPlatforms.join(','))} platform templates are located in ${chalk.white(
            c.files.project.config.platformTemplatesDirs[ejectedPlatforms[0]]
        )} now. You can edit them directly!`
    );
};

const _genPlatOptions = (c) => {
    const opts = generateOptions(c.buildConfig.defaults.supportedPlatforms, true, null, (i, obj, mapping, defaultVal) => {
        const isEjected = c.paths.project.platformTemplatesDirs[obj].includes(c.paths.rnv.platformTemplates.dir) ? chalk.green('(connected)') : chalk.yellow('(ejected)');
        return `-[${chalk.white(i + 1)}] ${chalk.white(defaultVal)} - ${isEjected} \n`;
    });
    return opts;
};

const _runConnectPlatforms = async (c) => {
    logTask('_runConnectPlatforms');

    const { connectedPlatforms } = await inquirer.prompt({
        name: 'connectedPlatforms',
        message: 'This will point platformTemplates folders from your local project to ReNative managed one. Select platforms you would like to connect',
        type: 'checkbox',
        choices: _generatePlatformChoices(c).map(choice => ({ ...choice, disabled: choice.isConnected }))
    });


    if (connectedPlatforms.length) {
        connectedPlatforms.forEach((platform) => {
            if (c.files.project.config.platformTemplatesDirs?.[platform]) {
                delete c.files.project.config.platformTemplatesDirs[platform];
            }

            if (!Object.keys(c.files.project.config.platformTemplatesDirs).length) {
                delete c.files.project.config.platformTemplatesDirs; // also cleanup the empty object
            }

            writeObjectSync(c.paths.project.config, c.files.project.config);
        });
    }

    const { deletePlatformFolder } = await inquirer.prompt({
        name: 'deletePlatformFolder',
        type: 'confirm',
        message: 'Would you also like to delete the previously used platform folder?'
    });

    if (deletePlatformFolder) {
        const pathsToRemove = [];
        connectedPlatforms.forEach((platform) => {
            pathsToRemove.push(path.join(c.paths.project.platformTemplatesDirs[platform], platform));
        });

        // TODO: Remove shared folders as well

        await removeDirs(pathsToRemove);
    }

    logSuccess(
        `${chalk.white(connectedPlatforms.join(','))} now using ReNative platformTemplates located in ${chalk.white(c.paths.rnv.platformTemplates.dir)} now!`
    );
};

const _runCopyPlatforms = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_runCopyPlatforms:${platform}`);
    const copyPlatformTasks = [];
    if (platform === 'all') {
        for (const k in c.buildConfig.platforms) {
            if (isPlatformSupportedSync(k)) {
                const ptPath = path.join(c.paths.project.platformTemplatesDirs[k], `${k}`);
                const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${k}`);
                copyPlatformTasks.push(copyFolderContentsRecursiveSync(ptPath, pPath));
            }
        }
    } else if (isPlatformSupportedSync(platform)) {
        const ptPath = path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`);
        const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);
        copyPlatformTasks.push(copyFolderContentsRecursiveSync(ptPath, pPath));
    } else {
        logWarning(`Your platform ${chalk.white(platform)} config is not present. Check ${chalk.white(c.paths.appConfig.config)}`);
    }

    Promise.all(copyPlatformTasks).then((values) => {
        resolve();
    });
});

const cleanPlatformBuild = (c, platform) => new Promise((resolve, reject) => {
    logTask(`cleanPlatformBuild:${platform}`);

    const cleanTasks = [];

    if (platform === 'all') {
        for (const k in c.buildConfig.platforms) {
            if (isPlatformSupportedSync(k)) {
                const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${k}`);
                cleanTasks.push(cleanFolder(pPath));
            }
        }
    } else if (isPlatformSupportedSync(platform)) {
        const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);
        cleanTasks.push(cleanFolder(pPath));
    }

    Promise.all(cleanTasks).then((values) => {
        resolve();
    });
});

const createPlatformBuild = (c, platform) => new Promise((resolve, reject) => {
    logTask(`createPlatformBuild:${platform}`);

    if (!isPlatformSupportedSync(platform, null, reject)) return;

    const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);
    const ptPath = path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`);
    copyFolderContentsRecursiveSync(ptPath, pPath, false, [path.join(ptPath, '_privateConfig')]);

    resolve();
});

export { createPlatformBuild, cleanPlatformBuild, PIPES };

export default run;
