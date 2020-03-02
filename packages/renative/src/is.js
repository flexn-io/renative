import platform from './Api/platform';
import factor from './Api/factor';
import {
    // PLATFORMS
    ANDROID, ANDROID_TV, ANDROID_WEAR, IOS, TVOS, WEB, WEBOS, TIZEN, TIZEN_WATCH, TIZEN_MOBILE, MACOS, WINDOWS, FIREFOX_OS, FIREFOX_TV, KAIOS
    // FACTORS

} from './Constants';

export const isAndroid = () => platform === ANDROID;
export const isAndroidtv = () => platform === ANDROID_TV;
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

export const isEngineWeb = platform === WEB || platform === TIZEN || platform === WEBOS || platform === MACOS || platform === TIZEN_MOBILE || platform === TIZEN_WATCH;


export const isBrowser = () => factor === 'browser';
export const isDesktop = () => factor === 'desktop';
export const isMobile = () => factor === 'mobile';
export const isTv = () => factor === 'tv';
export const isWatch = () => factor === 'watch';

export const isFactorBrowser = factor === 'browser';
export const isFactorDesktop = factor === 'desktop';
export const isFactorMobile = factor === 'mobile';
export const isFactorTv = factor === 'tv';
export const isFactorWatch = factor === 'watch';
