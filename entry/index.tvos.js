import { AppRegistry, Platform } from 'react-native';
import App from '../src/app';
import Api from '../src/api';
import { TVOS, FORM_FACTOR_TV } from '../rnv/src/constants';

Api.platform = TVOS;
Api.formFactor = FORM_FACTOR_TV;

AppRegistry.registerComponent('App', () => App);
