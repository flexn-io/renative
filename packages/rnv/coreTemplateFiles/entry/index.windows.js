import { AppRegistry } from 'react-native';
import App from './src/app';
import Config from './app.json';

AppRegistry.registerComponent(Config.name, () => App);
