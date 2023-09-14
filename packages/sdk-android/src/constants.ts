import { ANDROID, ANDROID_TV, ANDROID_WEAR, FIRE_TV } from 'rnv';

export const CLI_ANDROID_EMULATOR = 'androidEmulator';
export const CLI_ANDROID_ADB = 'androidAdb';
export const CLI_ANDROID_AVDMANAGER = 'androidAvdManager';
export const CLI_ANDROID_SDKMANAGER = 'androidSdkManager';

export const ANDROID_SDK = 'ANDROID_SDK';
export const ANDROID_NDK = 'ANDROID_NDK';

export const SDK_PLATFORMS: any = {};
SDK_PLATFORMS[ANDROID] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_TV] = ANDROID_SDK;
SDK_PLATFORMS[FIRE_TV] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_WEAR] = ANDROID_SDK;
