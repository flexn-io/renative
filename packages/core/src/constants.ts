import { PlatformName } from './enums/platformName';

// DEPRECATED
export const SUPPORTED_PLATFORMS = [
    PlatformName.ios,
    PlatformName.android,
    PlatformName.androidtv,
    PlatformName.androidwear,
    PlatformName.firetv,
    PlatformName.web,
    PlatformName.webtv,
    PlatformName.tizen,
    PlatformName.tizenmobile,
    PlatformName.tvos,
    PlatformName.webos,
    PlatformName.macos,
    PlatformName.windows,
    PlatformName.linux,
    PlatformName.tizenwatch,
    PlatformName.kaios,
    PlatformName.chromecast,
    PlatformName.xbox,
] as const;
