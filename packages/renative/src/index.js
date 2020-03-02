import Icon from './Icon';
import Button from './Button';
import Api, { getScaledValue } from './Api';
import { createNavigator, createNavigatorView, createApp } from './Navigation';
import { createSideMenuNavigator, SideMenu, createTabNavigator } from './Navigation/menuNavigator';
import registerServiceWorker from './serviceWorker';
import registerFocusManger from './focus';
import platform from './Api/platform';
import factor from './Api/factor';
import engine from './Api/engine';
import { useNavigate, usePop } from './hooks/navigation';
import { ANDROID, ANDROID_TV, ANDROID_WEAR, IOS, TVOS, WEB, WEBOS, TIZEN, TIZEN_WATCH, TIZEN_MOBILE, MACOS, WINDOWS, FIREFOX_OS, FIREFOX_TV, KAIOS } from './Constants';
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
    isFactorBrowser,
    isFactorDesktop,
    isFactorMobile,
    isFactorTv,
    isFactorWatch,
    // NEW
    isEngineWeb
} from './is';

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
    // PLATFORM
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
    // FACTOR
    isBrowser,
    isDesktop,
    isMobile,
    isTv,
    isWatch,
    isFactorBrowser,
    isFactorDesktop,
    isFactorMobile,
    isFactorTv,
    isFactorWatch,
    useNavigate,
    usePop,
    // ENGINE
    isEngineWeb,
    engine
};
//
// export default {
//   Screen: (props) =>
// }
