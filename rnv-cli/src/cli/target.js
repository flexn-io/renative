import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { isPlatformSupportedSync, getConfig, logTask, logComplete, logError, getAppFolder } from '../common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator } from '../platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from '../platformTools/android';
import { listAppleDevices, launchAppleSimulator } from '../platformTools/apple';
import { launchKaiOSSimulator } from '../platformTools/firefox';

const CREATE = 'create';
const REMOVE = 'remove';
const LAUNCH = 'launch';
const QUIT = 'quit';
const LIST = 'list';

const PIPES = {
    TARGET_CREATE_BEFORE: 'target:create:before',
    TARGET_CREATE_AFTER: 'target:create:after',
    TARGET_REMOVE_BEFORE: 'target:remove:before',
    TARGET_REMOVE_AFTER: 'target:remove:after',
    TARGET_LAUNCH_BEFORE: 'target:launch:before',
    TARGET_LAUNCH_AFTER: 'target:launch:after',
    TARGET_QUIT_BEFORE: 'target:quit:before',
    TARGET_QUIT_AFTER: 'target:quit:after',
    TARGET_LIST_BEFORE: 'target:list:before',
    TARGET_LIST_AFTER: 'target:list:after',
};

// ##########################################
// PUBLIC API
// ##########################################

const run = c =>
    new Promise((resolve, reject) => {
        logTask('run');

        if (!isPlatformSupportedSync(c.program.platform, null, reject)) return;

        switch (c.subCommand) {
            // case CREATE:
            //     return Promise.resolve();
            //     break;
            // case REMOVE:
            //     return Promise.resolve();
            //     break;
            case LAUNCH:
                _runLaunch(c)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            // case QUIT:
            //     return Promise.resolve();
            //     break;
            case LIST:
                _runList(c)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            default:
                return Promise.reject(`Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
        }
    });

// ##########################################
// PRIVATE
// ##########################################

const _runLaunch = c =>
    new Promise((resolve, reject) => {
        logTask('_runLaunch');
        const { platform, program } = c;
        const target = program.target || c.files.globalConfig.defaultTargets[platform];

        switch (platform) {
            case ANDROID:
            case ANDROID_TV:
            case ANDROID_WEAR:
                launchAndroidSimulator(c, platform, target)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            case IOS:
            case TVOS:
                launchAppleSimulator(c, platform, target)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            case TIZEN:
                launchTizenSimulator(c, target)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            case WEBOS:
                launchWebOSimulator(c, target)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            case KAIOS:
                launchKaiOSSimulator(c, target)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            default:
                reject(
                    `"target launch" command does not support ${chalk.white.bold(
                        platform
                    )} platform yet. You will have to launch the emulator manually. Working on it!`
                );
        }
    });

const _runList = c =>
    new Promise((resolve, reject) => {
        logTask('_runLaunch');
        const { platform, program } = c;
        const { target } = program;
        if (!isPlatformSupportedSync(platform)) return;

        switch (platform) {
            case ANDROID:
            case ANDROID_TV:
            case ANDROID_WEAR:
                listAndroidTargets(c, platform)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            case IOS:
            case TVOS:
                listAppleDevices(c, platform)
                    .then(() => resolve())
                    .catch(e => reject(e));
                return;
            default:
                reject(`"target list" command does not support ${chalk.white.bold(platform)} platform yet. Working on it!`);
        }
    });

export { PIPES };

export default run;
