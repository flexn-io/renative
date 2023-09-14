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
import { checkAndConfigureAndroidSdks } from '@rnv/sdk-android';
import { checkAndConfigureTizenSdks } from '@rnv/sdk-tizen';
import { checkAndConfigureWebosSdks } from '@rnv/sdk-webos';

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
