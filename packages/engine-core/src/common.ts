import { getContext, logDefault } from '@rnv/core';
import { checkAndConfigureAndroidSdks, checkAndroidSdk } from '@rnv/sdk-android';
import { checkAndConfigureTizenSdks, checkTizenSdk } from '@rnv/sdk-tizen';
import { checkAndConfigureWebosSdks, checkWebosSdk } from '@rnv/sdk-webos';

export const checkAndConfigureSdks = async () => {
    logDefault('checkAndConfigureSdks');

    const c = getContext();

    switch (c.platform) {
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            return checkAndConfigureAndroidSdks();
        case 'tizen':
        case 'tizenmobile':
        case 'tizenwatch':
            return checkAndConfigureTizenSdks();
        case 'webos':
            return checkAndConfigureWebosSdks();
        default:
            return true;
    }
};

export const checkSdk = async () => {
    logDefault('checkSdk');
    const c = getContext();

    switch (c.platform) {
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            return checkAndroidSdk();
        case 'tizen':
        case 'tizenmobile':
        case 'tizenwatch':
            return checkTizenSdk();
        case 'webos':
            return checkWebosSdk();
        default:
            return true;
    }
};
