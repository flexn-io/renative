import { AppRegistry, Platform } from 'react-native';
import { Api } from 'renative';
import { TVOS, FORM_FACTOR_TV } from 'renative';
import App from './src/app';


Api.platform = TVOS;
Api.formFactor = FORM_FACTOR_TV;

AppRegistry.registerComponent('App', () => App);
