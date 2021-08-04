import { AppRegistry } from 'react-native';
import App from './src/components/screenHome';
import Config from './app.json';

AppRegistry.registerComponent(Config.name, () => App);
