import { AppRegistry, Platform } from 'react-native';
import { Api } from 'renative';
import { TVOS, FORM_FACTOR_TV } from 'renative';
import App from './src/app';
import spatialFocus from './src/utils/focus';

Api.platform = TVOS;
Api.formFactor = FORM_FACTOR_TV;
spatialFocus();
AppRegistry.registerComponent('App', () => App);
