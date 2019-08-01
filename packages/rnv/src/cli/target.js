/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import path from 'path';
import inquirer from 'inquirer';
import {
    isPlatformSupportedSync, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformSupported, checkSdk
} from '../common';
import PlatformSetup from '../setupTools';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS, CLI_ANDROID_ADB, CLI_ANDROID_AVDMANAGER, CLI_ANDROID_EMULATOR, CLI_ANDROID_SDKMANAGER } from '../constants';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator, listWebOSTargets } from '../platformTools/webos';
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

const run = c => new Promise((resolve, reject) => {
    logTask('run');

    switch (c.subCommand) {
    // case CREATE:
    //     return Promise.resolve();
    //     break;
    // case REMOVE:
    //     return Promise.resolve();
    //     break;
    case LAUNCH:
        isPlatformSupported(c)
            .then(() => _runLaunch(c))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
        // case QUIT:
        //     return Promise.resolve();
        //     break;
    case LIST:
        isPlatformSupported(c)
            .then(() => _runList(c))
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

const _runLaunch = c => new Promise((resolve, reject) => {
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

const _runList = async (c) => {
    logTask('_runLaunch');
    const { platform } = c;
    if (!isPlatformSupportedSync(platform)) return;

    const throwError = (err) => {
        throw err;
    };

    switch (platform) {
    case ANDROID:
    case ANDROID_TV:
    case ANDROID_WEAR:
        if (!checkSdk(c, platform, logError)) {
            let sdkInstall;
            if (!c.program.ci) {
                const response = await inquirer.prompt([{
                    name: 'sdkInstall',
                    type: 'confirm',
                    message: 'Do you want to install the Android SDK?',
                }]);
                // eslint-disable-next-line prefer-destructuring
                sdkInstall = response.sdkInstall;
            }

            const isRunningOnWindows = process.platform === 'win32';

            if (c.program.ci || sdkInstall) {
                const setupInstance = PlatformSetup(c);
                const newPath = await setupInstance.installAndroidSdk();
                // @todo find a more elegant way to update this
                c.files.globalConfig.sdks.ANDROID_SDK = newPath;
                const { sdks: { ANDROID_SDK } } = c.files.globalConfig;
                c.cli[CLI_ANDROID_EMULATOR] = path.join(ANDROID_SDK, `emulator/emulator${isRunningOnWindows ? '.exe' : ''}`);
                c.cli[CLI_ANDROID_ADB] = path.join(ANDROID_SDK, `platform-tools/adb${isRunningOnWindows ? '.exe' : ''}`);
                c.cli[CLI_ANDROID_AVDMANAGER] = path.join(ANDROID_SDK, `tools/bin/avdmanager${isRunningOnWindows ? '.bat' : ''}`);
                c.cli[CLI_ANDROID_SDKMANAGER] = path.join(ANDROID_SDK, `tools/bin/sdkmanager${isRunningOnWindows ? '.bat' : ''}`);
            }
        }
        return listAndroidTargets(c, platform);
    case IOS:
    case TVOS:
        return listAppleDevices(c, platform);
    case WEBOS:
        if (!checkSdk(c, platform, throwError)) return;
        return listWebOSTargets(c);
    default:
        throw `"target list" command does not support ${chalk.white.bold(platform)} platform yet. Working on it!`;
    }
};

export { PIPES };

export default run;
