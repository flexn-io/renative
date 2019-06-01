import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { Api } from 'renative';
import { ANDROID_TV, FORM_FACTOR_TV } from 'renative';

Api.platform = ANDROID_TV;
Api.formFactor = FORM_FACTOR_TV;

AppRegistry.registerComponent('App', () => App);
