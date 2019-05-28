import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { Api } from './src/renative';
import { IOS, FORM_FACTOR_MOBILE } from './src/renative';

Api.platform = IOS;
Api.formFactor = FORM_FACTOR_MOBILE;

AppRegistry.registerComponent('App', () => App);
