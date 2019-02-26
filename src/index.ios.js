import { AppRegistry, Platform } from 'react-native';
import App from './app';
import Api from './api';

const { isTV } = Platform;

Api.platform = isTV ? 'tvos' : 'ios';

AppRegistry.registerComponent('App', () => App);
