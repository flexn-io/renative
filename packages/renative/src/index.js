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

export * from './hooks/linking';
export * from './Constants';
export * from './is';
export * from './hooks/navigation';

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
    // HOOKS
    engine
};
