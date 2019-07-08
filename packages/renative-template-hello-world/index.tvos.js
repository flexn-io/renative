import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { Api } from 'renative';
import { TVOS, FORM_FACTOR_TV } from 'renative';

Api.platform = TVOS;
Api.formFactor = FORM_FACTOR_TV;

AppRegistry.registerComponent('App', () => App);
