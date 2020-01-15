import Icon from './Icon';
import Button from './Button';
import Api, { getScaledValue } from './Api';
import { createNavigator, createNavigatorView, createApp } from './Navigation';
import { createSideMenuNavigator, SideMenu, createTabNavigator } from './Navigation/menuNavigator';
import registerServiceWorker from './serviceWorker';
import registerFocusManger from './focus';
import platform from './Api/platform';
import factor from './Api/factor';
import { ANDROID, ANDROID_TV, ANDROID_WEAR, IOS, TVOS, WEB, WEBOS, TIZEN, TIZEN_WATCH, TIZEN_MOBILE, MACOS, WINDOWS, FIREFOX_OS, FIREFOX_TV, KAIOS } from './Constants'
import {
isAndroid,
isAndroidtv,
isAndroidwear,
isIos,
isTvos,
isWeb,
isWebos,
isTizen,
isTizenwatch,
isTizenmobile,
isMacos,
isWindows,
isFirefoxos,
isFirefoxtv,
isKaios,
isBrowser,
isDesktop,
isMobile,
isTv,
isWatch,
} from './is'

export {
    Icon,
    Button,
    Api,
    createNavigator,
    createNavigatorView,
    createApp,
    registerServiceWorker,
    registerFocusManger,
    createSideMenuNavigator,
    SideMenu,
    createTabNavigator,
    getScaledValue,
    ANDROID, ANDROID_TV, ANDROID_WEAR, IOS, TVOS, WEB, WEBOS, TIZEN, TIZEN_WATCH, TIZEN_MOBILE, MACOS, WINDOWS, FIREFOX_OS, FIREFOX_TV, KAIOS,
    isAndroid,
    isAndroidtv,
    isAndroidwear,
    isIos,
    isTvos,
    isWeb,
    isWebos,
    isTizen,
    isTizenwatch,
    isTizenmobile,
    isMacos,
    isWindows,
    isFirefoxos,
    isFirefoxtv,
    isKaios,
    isBrowser,
    isDesktop,
    isMobile,
    isTv,
    isWatch,
};
