import { logDefault, RnvContext } from '@rnv/core';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '@rnv/sdk-android';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '@rnv/sdk-tizen';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '@rnv/sdk-webos';

export const checkAndConfigureSdks = async (c: RnvContext) => {
    logDefault('checkAndConfigureSdks');

    switch (c.platform) {
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            return checkAndConfigureAndroidSdks(c);
        case 'tizen':
        case 'tizenmobile':
        case 'tizenwatch':
            return checkAndConfigureTizenSdks(c);
        case 'webos':
            return checkAndConfigureWebosSdks(c);
        default:
            return true;
    }
};

export const checkSdk = async (c: RnvContext) => {
    logDefault('checkSdk');

    switch (c.platform) {
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            return checkAndroidSdk(c);
        case 'tizen':
        case 'tizenmobile':
        case 'tizenwatch':
            return checkTizenSdk(c);
        case 'webos':
            return checkWebosSdk(c);
        default:
            return true;
    }
};
