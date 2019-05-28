import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { Api } from './src/renative';
import { TVOS, FORM_FACTOR_TV } from './src/renative';

Api.platform = TVOS;
Api.formFactor = FORM_FACTOR_TV;

AppRegistry.registerComponent('App', () => App);
