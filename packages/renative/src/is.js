import platform from './Api/platform';
import factor from './Api/factor';
import engine from './Api/engine';
import {
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    IOS,
    TVOS,
    WEB,
    WEBTV,
    WEBOS,
    TIZEN,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    MACOS,
    WINDOWS,
    FIREFOX_OS,
    FIREFOX_TV,
    KAIOS,
    XBOX
} from './Constants';

// PLATFORM
export const isPlatformAndroid = platform === ANDROID;
export const isPlatformAndroidtv = platform === ANDROID_TV;
export const isPlatformFiretv = platform === FIRE_TV;
export const isPlatformAndroidwear = platform === ANDROID_WEAR;
export const isPlatformIos = platform === IOS;
export const isPlatformTvos = platform === TVOS;
export const isPlatformWeb = platform === WEB;
export const isPlatformWebos = platform === WEBOS;
export const isPlatformTizen = platform === TIZEN;
export const isPlatformTizenwatch = platform === TIZEN_WATCH;
export const isPlatformTizenmobile = platform === TIZEN_MOBILE;
export const isPlatformMacos = platform === MACOS;
export const isPlatformWindows = platform === WINDOWS;
export const isPlatformFirefoxos = platform === FIREFOX_OS;
export const isPlatformFirefoxtv = platform === FIREFOX_TV;
export const isPlatformKaios = platform === KAIOS;
export const isPlatformWebtv = platform === WEBTV;
export const isPlatformXbox = platform === XBOX;

// FACTOR
export const isFactorBrowser = factor === 'browser';
export const isFactorDesktop = factor === 'desktop';
export const isFactorMobile = factor === 'mobile';
export const isFactorTv = factor === 'tv';
export const isFactorWatch = factor === 'watch';

export const isEngineRnElectron = engine === 'engine-rn-electron';
export const isEngineRnMacos = engine === 'engine-rn-macos';
export const isEngineRnNext = engine === 'engine-rn-next';
export const isEngineRnWeb = engine === 'engine-rn-web';
export const isEngineRn = engine === 'engine-rn';

// =================================================
// DEPRECATED

export const isEngineWeb = platform === WEB
    || platform === TIZEN
    || platform === WEBOS
    || platform === MACOS
    || platform === TIZEN_MOBILE
    || platform === TIZEN_WATCH;
export const isEngineNative = platform === ANDROID
    || platform === ANDROID_TV
    || platform === FIRE_TV
    || platform === ANDROID_WEAR
    || platform === IOS
    || platform === TVOS;

export const isBrowser = () => factor === 'browser';
export const isDesktop = () => factor === 'desktop';
export const isMobile = () => factor === 'mobile';
export const isTv = () => factor === 'tv';
export const isWatch = () => factor === 'watch';

export const isAndroid = () => platform === ANDROID;
export const isAndroidtv = () => platform === ANDROID_TV;
export const isFiretv = () => platform === FIRE_TV;
export const isAndroidwear = () => platform === ANDROID_WEAR;
export const isIos = () => platform === IOS;
export const isTvos = () => platform === TVOS;
export const isWeb = () => platform === WEB;
export const isWebos = () => platform === WEBOS;
export const isTizen = () => platform === TIZEN;
export const isTizenwatch = () => platform === TIZEN_WATCH;
export const isTizenmobile = () => platform === TIZEN_MOBILE;
export const isMacos = () => platform === MACOS;
export const isWindows = () => platform === WINDOWS;
export const isFirefoxos = () => platform === FIREFOX_OS;
export const isFirefoxtv = () => platform === FIREFOX_TV;
export const isKaios = () => platform === KAIOS;
export const isWebtv = () => platform === WEBTV;

// DEPRECATED
// =================================================
