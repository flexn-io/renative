import { ANDROID, TIZEN, WEBOS, ANDROID_TV, FIRE_TV, ANDROID_WEAR, TIZEN_MOBILE, TIZEN_WATCH } from '../constants';
import { logTask } from '../systemManager/logger';
import { RnvContext } from '../context/types';

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
