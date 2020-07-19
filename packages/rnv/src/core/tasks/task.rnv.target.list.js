/* eslint-disable import/no-cycle */
import { isPlatformSupported } from '../platformManager';
import { chalk, logTask } from '../systemManager/logger';
import {
    listAndroidTargets,
} from '../../sdk-android/deviceManager';
import { checkSdk } from '../sdkManager';
import {
    IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
} from '../constants';
import { listTizenTargets } from '../../sdk-tizen';
import { listWebOSTargets } from '../../sdk-webos';
import { listAppleDevices } from '../../sdk-xcode/deviceManager';


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
