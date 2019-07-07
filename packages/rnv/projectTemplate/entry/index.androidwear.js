import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { Api } from 'renative';
import { ANDROID_WEAR, FORM_FACTOR_WATCH } from 'renative';

Api.platform = ANDROID_WEAR;
Api.formFactor = FORM_FACTOR_WATCH;

AppRegistry.registerComponent('App', () => App);
