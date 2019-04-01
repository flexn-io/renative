import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import Api from './src/api';
import { ANDROID_WEAR, FORM_FACTOR_WATCH } from './src/constants';

Api.platform = ANDROID_WEAR;
Api.formFactor = FORM_FACTOR_WATCH;

AppRegistry.registerComponent('App', () => App);
