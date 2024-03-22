import { RnvPlatformName } from './enums/platformName';

// IMPORTANT: this must match RnvPlatformName
export const SUPPORTED_PLATFORMS = [
    RnvPlatformName.web,
    RnvPlatformName.ios,
    RnvPlatformName.android,
    RnvPlatformName.androidtv,
    RnvPlatformName.firetv,
    RnvPlatformName.tvos,
    RnvPlatformName.macos,
    RnvPlatformName.linux,
    RnvPlatformName.windows,
    RnvPlatformName.tizen,
    RnvPlatformName.webos,
    RnvPlatformName.chromecast,
    RnvPlatformName.kaios,
    RnvPlatformName.webtv,
    RnvPlatformName.androidwear,
    RnvPlatformName.tizenwatch,
    RnvPlatformName.tizenmobile,
    RnvPlatformName.xbox,
] as const;
