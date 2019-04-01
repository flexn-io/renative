import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import Api from './src/api';
import { IOS, FORM_FACTOR_MOBILE } from './src/constants';

Api.platform = IOS;
Api.formFactor = FORM_FACTOR_MOBILE;

AppRegistry.registerComponent('App', () => App);
