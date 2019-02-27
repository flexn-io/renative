import { AppRegistry, Platform } from 'react-native';
import App from '../src/app';
import Api from '../src/api';

Api.platform = 'androidwear';

AppRegistry.registerComponent('App', () => App);
