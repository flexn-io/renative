import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { Api } from './src/renative';
import { ANDROID, FORM_FACTOR_TV } from './src/renative';

Api.platform = ANDROID;
Api.formFactor = FORM_FACTOR_TV;

AppRegistry.registerComponent('App', () => App);
