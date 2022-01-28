import { AppRegistry } from 'react-native';
import JSTimers from 'react-native/Libraries/Core/Timers/JSTimers';
import App from '../app';

if (!global.setImmediate) {
    global.setImmediate = JSTimers.setImmediate;
}

AppRegistry.registerComponent('App', () => App);
