import Icon from './Icon';
import Button from './Button';
import Api from './Api';
import { createNavigator, createNavigatorView, createApp } from './Navigation';
import { createSideMenuNavigator, SideMenu, createTabNavigator } from './Navigation/menuNavigator';
import registerServiceWorker from './serviceWorker';
import registerFocusManger from './focus';
import platform from './Api/platform';
import {
    ANDROID,
    ANDROID_AUTO,
    ANDROID_TV,
    ANDROID_WEAR,
    ALEXA,
    APPLE_AUTO,
    BLACKBERRY,
    CHROMECAST,
    CHROME_OS,
    FIREFOX_OS,
    FIRE_OS,
    FIRE_TV,
    HBBTV,
    IOS,
    KAIOS,
    MACOS,
    NETCAST,
    OCCULUS,
    ORSAY,
    PS4,
    ROKU,
    TIVO,
    TIZEN,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    TVOS,
    UBUNTU,
    UNITY,
    VEWD,
    VIZIO,
    WATCHOS,
    WEB,
    WEBNEXT,
    WEBOS,
    WII,
    WINDOWS,
    WP10,
    WP8,
    XBOX,
    XBOX360,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
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
export const isTizenphone = () => platform === TIZEN_MOBILE;
export const isMacos = () => platform === MACOS;
export const isWindows = () => platform === WINDOWS;
export const isFirefoxos = () => platform === FIREFOX_OS;
export const isFirefoxtv = () => platform === FIREFOX_TV;
export const isKaios = () => platform === KAIOS;

export {
    Icon,
    Button,
    Api,
    createNavigator,
    createNavigatorView,
    createApp,
    registerServiceWorker,
    ANDROID,
    ANDROID_AUTO,
    ANDROID_TV,
    ANDROID_WEAR,
    ALEXA,
    APPLE_AUTO,
    BLACKBERRY,
    CHROMECAST,
    CHROME_OS,
    FIREFOX_OS,
    FIRE_OS,
    FIRE_TV,
    HBBTV,
    IOS,
    KAIOS,
    MACOS,
    NETCAST,
    OCCULUS,
    ORSAY,
    PS4,
    ROKU,
    TIVO,
    TIZEN,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    TVOS,
    UBUNTU,
    UNITY,
    VEWD,
    VIZIO,
    WATCHOS,
    WEB,
    WEBNEXT,
    WEBOS,
    WII,
    WINDOWS,
    WP10,
    WP8,
    XBOX,
    XBOX360,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
    registerFocusManger,
    createSideMenuNavigator,
    SideMenu,
    createTabNavigator
};
