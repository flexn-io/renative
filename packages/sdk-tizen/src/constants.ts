import { TIZEN, TIZEN_MOBILE, TIZEN_WATCH } from 'rnv';

export const CLI_TIZEN_EMULATOR = 'tizenEmulator';
export const CLI_TIZEN = 'tizen';
export const CLI_SDB_TIZEN = 'tizenSdb';

export const TIZEN_SDK = 'TIZEN_SDK';

export const SDK_PLATFORMS: any = {};
SDK_PLATFORMS[TIZEN] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_WATCH] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_MOBILE] = TIZEN_SDK;
