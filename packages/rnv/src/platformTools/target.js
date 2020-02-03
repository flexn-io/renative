/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import { isPlatformSupported } from './index';
import { logTask, logError } from '../systemTools/logger';
import { checkSdk } from './sdkManager';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { launchTizenSimulator, listTizenTargets } from './tizen';
import { launchWebOSimulator, listWebOSTargets } from './webos';
import { listAndroidTargets, launchAndroidSimulator } from './android/deviceManager';
import { listAppleDevices, launchAppleSimulator } from './apple/deviceManager';
import { launchKaiOSSimulator } from './firefox';

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
                `"target launch" command does not support ${chalk.white.bold(
                    platform
                )} platform yet. You will have to launch the emulator manually. Working on it!`
            );
    }
};

export const rnvTargetList = async (c) => {
    logTask('rnvTargetList');

    await isPlatformSupported(c);

    const { platform } = c;

    const throwError = (err) => {
        throw err;
    };

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
            return Promise.reject(`"target list" command does not support ${chalk.white.bold(platform)} platform yet. Working on it!`);
    }
};
