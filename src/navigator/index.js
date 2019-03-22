import { Platform } from 'react-native';
import { TVOS } from '../constants';

const nav = Platform.isTV ? require('./index.tv.js').default : require('./index.mobile.js').default;

const createApp = navigator => nav.createApp(navigator);

const createNavigator = (screens, menu) => nav.createNavigator(screens, menu);

const createNavigatorView = (Navigator, navigation) => nav.createNavigatorView(Navigator, navigation);

export { createNavigator, createNavigatorView, createApp };
