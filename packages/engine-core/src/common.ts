import {
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    FIRE_TV,
    logTask,
    RnvContext,
    TIZEN,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    WEBOS,
} from 'rnv';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '@rnv/sdk-android';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '@rnv/sdk-tizen';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '@rnv/sdk-webos';

export const checkAndConfigureSdks = async (c: RnvContext) => {
    logTask('checkAndConfigureSdks');

    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            return checkAndConfigureAndroidSdks(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            return checkAndConfigureTizenSdks(c);
        case WEBOS:
            return checkAndConfigureWebosSdks(c);
        default:
            return true;
    }
};

export const checkSdk = async (c: RnvContext) => {
    logTask('checkSdk');

    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            return checkAndroidSdk(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            return checkTizenSdk(c);
        case WEBOS:
            return checkWebosSdk(c);
        default:
            return true;
    }
};
