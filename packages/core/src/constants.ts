// PLATFORM
const ANDROID = 'android';
// const ANDROID_AUTO = 'androidauto';
const ANDROID_TV = 'androidtv';
const ANDROID_WEAR = 'androidwear';
// const ALEXA = 'alexa';
// const APPLE_AUTO = 'appleauto';
// const ASTIAN = 'astian';
// const BLACKBERRY = 'blackberry';
const CHROMECAST = 'chromecast';
// const CHROME_OS = 'chromeos';
// const FIRE_OS = 'fireos';
const FIRE_TV = 'firetv';
// const HBBTV = 'hbbtv';
const IOS = 'ios';
const KAIOS = 'kaios';
const MACOS = 'macos';
// const MEEGO = 'meego';
// const NETCAST = 'netcast';
// const OCCULUS = 'occulus';
// const ORSAY = 'orsay';
// const PS4 = 'ps4';
// const ROKU = 'roku';
// const SAILFISH = 'sailfish';
// const TIVO = 'tivo';
const TIZEN = 'tizen';
const TIZEN_WATCH = 'tizenwatch';
const TIZEN_MOBILE = 'tizenmobile';
const TVOS = 'tvos';
// const UBUNTU = 'ubuntu';
// const UBUNTU_TOUCH = 'ubuntutouch';
// const UNITY = 'unity';
// const VEWD = 'vewd';
// const VIDAA = 'vidaa';
// const VIERACONNECT = 'vieraconnect';
// const VIZIO = 'vizio';
// const WATCHOS = 'watchos';
const WEB = 'web';
const WEBTV = 'webtv';
const WEBOS = 'webos';
// const WEBIAN = 'webian';
// const WII = 'wii';
const WINDOWS = 'windows';
const LINUX = 'linux';
// const WP10 = 'wp10';
// const WP8 = 'wp8';
const XBOX = 'xbox';
// const XBOX360 = 'xbox360';
// Kodi, Boxee, HorizonTV, Mediaroom(Ericsson), YahooSmartTV, Slingbox, Hololens, Occulus, GearVR, WebVR, Saphi

export const RENATIVE_CONFIG_NAME = 'renative.json';
export const RENATIVE_CONFIG_LOCAL_NAME = 'renative.local.json';
export const RENATIVE_CONFIG_PRIVATE_NAME = 'renative.private.json';
export const RENATIVE_CONFIG_TEMPLATE_NAME = 'renative.template.json';
export const RENATIVE_CONFIG_BUILD_NAME = 'renative.build.json';
export const RENATIVE_CONFIG_RUNTIME_NAME = 'renative.runtime.json';
export const RENATIVE_CONFIG_WORKSPACES_NAME = 'renative.workspaces.json';
export const RENATIVE_CONFIG_PLUGINS_NAME = 'renative.plugins.json';
export const RENATIVE_CONFIG_TEMPLATES_NAME = 'renative.templates.json';
export const RENATIVE_CONFIG_PLATFORMS_NAME = 'renative.platforms.json';
export const RENATIVE_CONFIG_ENGINE_NAME = 'renative.engine.json';

// DEPRECATED
export const SUPPORTED_PLATFORMS = [
    IOS,
    ANDROID,
    FIRE_TV,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    WEBTV,
    TIZEN,
    TIZEN_MOBILE,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    LINUX,
    TIZEN_WATCH,
    KAIOS,
    CHROMECAST,
    XBOX,
] as const;
