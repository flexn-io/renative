import engine from './Api/engine';
import factor from './Api/factor';
import platform from './Api/platform';
import { Platform, FormFactor, Engine } from './Constants';

// PLATFORM
export const isPlatformAndroid = platform === Platform.android;
export const isPlatformAndroidtv = platform === Platform.androidtv;
export const isPlatformFiretv = platform === Platform.firetv;
export const isPlatformAndroidwear = platform === Platform.androidwear;
export const isPlatformIos = platform === Platform.ios;
export const isPlatformTvos = platform === Platform.tvos;
export const isPlatformWeb = platform === Platform.web;
export const isPlatformWebos = platform === Platform.webos;
export const isPlatformTizen = platform === Platform.tizen;
export const isPlatformTizenwatch = platform === Platform.tizenwatch;
export const isPlatformTizenmobile = platform === Platform.tizenmobile;
export const isPlatformMacos = platform === Platform.macos;
export const isPlatformWindows = platform === Platform.windows;
export const isPlatformLinux = platform === Platform.linux;
export const isPlatformFirefoxos = platform === Platform.firefoxos;
export const isPlatformFirefoxtv = platform === Platform.firefoxtv;
export const isPlatformKaios = platform === Platform.kaios;
export const isPlatformWebtv = platform === Platform.webtv;
export const isPlatformXbox = platform === Platform.xbox;

// FACTOR
export const isFactorBrowser = factor === FormFactor.browser;
export const isFactorDesktop = factor === FormFactor.desktop;
export const isFactorMobile = factor === FormFactor.mobile;
export const isFactorTv = factor === FormFactor.tv;
export const isFactorWatch = factor === FormFactor.watch;

export const isEngineRnElectron = engine === Engine.rn_electron;
export const isEngineRnMacos = engine === Engine.rn_macos;
export const isEngineRnWindows = engine === Engine.rn_windows;
export const isEngineRnNext = engine === Engine.rn_next;
export const isEngineRnWeb = engine === Engine.rn_web;
export const isEngineRn = engine === Engine.rn;

export const isBrowser = () => factor === FormFactor.browser;
export const isDesktop = () => factor === FormFactor.desktop;
export const isMobile = () => factor === FormFactor.mobile;
export const isTv = () => factor === FormFactor.tv;
export const isWatch = () => factor === FormFactor.watch;

export const isAndroid = () => platform === Platform.android;
export const isAndroidtv = () => platform === Platform.androidtv;
export const isFiretv = () => platform === Platform.firetv;
export const isAndroidwear = () => platform === Platform.androidwear;
export const isIos = () => platform === Platform.ios;
export const isTvos = () => platform === Platform.tvos;
export const isWeb = () => platform === Platform.web;
export const isWebos = () => platform === Platform.webos;
export const isTizen = () => platform === Platform.tizen;
export const isTizenwatch = () => platform === Platform.tizenwatch;
export const isTizenmobile = () => platform === Platform.tizenmobile;
export const isMacos = () => platform === Platform.macos;
export const isWindows = () => platform === Platform.windows;
export const isFirefoxos = () => platform === Platform.firefoxos;
export const isFirefoxtv = () => platform === Platform.firefoxtv;
export const isKaios = () => platform === Platform.kaios;
export const isWebtv = () => platform === Platform.webtv;
