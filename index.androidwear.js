import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { Api } from './src/renative';
import { ANDROID_WEAR, FORM_FACTOR_WATCH } from './src/renative';

Api.platform = ANDROID_WEAR;
Api.formFactor = FORM_FACTOR_WATCH;

AppRegistry.registerComponent('App', () => App);
