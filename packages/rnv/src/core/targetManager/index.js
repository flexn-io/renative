/* eslint-disable import/no-cycle */
import ora from 'ora';
import { execCLI } from '../systemManager/exec';
import { isPlatformSupported } from '../platformManager';
import { chalk, logTask } from '../systemManager/logger';
import { checkSdk } from '../sdkManager';
import {
    IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    KAIOS
} from '../constants';
import { launchTizenSimulator, listTizenTargets } from '../../sdk-tizen';
import { launchWebOSimulator, listWebOSTargets } from '../../sdk-webos';
import {
    listAndroidTargets,
    launchAndroidSimulator
} from '../../sdk-android/deviceManager';
import { listAppleDevices, launchAppleSimulator } from '../../sdk-xcode/deviceManager';
import { launchKaiOSSimulator } from '../../sdk-firefox';

export const waitForEmulator = async (c, cli, command, callback) => {
    let attempts = 0;
    const maxAttempts = 30;
    const CHECK_INTEVAL = 2000;
    const { maxErrorLength } = c.program;
    const spinner = ora('Waiting for emulator to boot...').start();

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            execCLI(c, cli, command, {
                silent: true,
                timeout: 10000,
                maxErrorLength
            })
                .then((resp) => {
                    if (callback(resp)) {
                        clearInterval(interval);
                        spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        spinner.fail(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                        return reject(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        spinner.fail(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                        return reject(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const rnvTargetLaunch = async (c) => {
    logTask('_runLaunch');

    await isPlatformSupported(c);

    const { platform, program } = c;
    const target = program.target || c.files.workspace.config.defaultTargets[platform];

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return launchAndroidSimulator(c, platform, target);
        case IOS:
        case TVOS:
            return launchAppleSimulator(c, platform, target);
        case TIZEN:
            return launchTizenSimulator(c, target);
        case WEBOS:
            return launchWebOSimulator(c, target);
        case KAIOS:
            return launchKaiOSSimulator(c, target);
        default:
            return Promise.reject(
                `"target launch" command does not support ${chalk().white.bold(
                    platform
                )} platform yet. You will have to launch the emulator manually. Working on it!`
            );
    }
};

export const rnvTargetList = async (c) => {
    logTask('rnvTargetList');

    await isPlatformSupported(c);

    const { platform } = c;

    // const throwError = (err) => {
    //     throw err;
    // };

    await checkSdk(c);

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return listAndroidTargets(c, platform);
        case IOS:
        case TVOS:
            return listAppleDevices(c, platform);
        case TIZEN:
            return listTizenTargets(c, platform);
        case WEBOS:
            return listWebOSTargets(c);
        default:
            return Promise.reject(
                `"target list" command does not support ${chalk().white.bold(
                    platform
                )} platform yet. Working on it!`
            );
    }
};
