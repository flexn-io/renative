import React from 'react';
import ReactDOM from 'react-dom';
import { AppRegistry } from 'react-native';
import { isEngineRnWindows } from 'renative';
import App from './src/app';
import { name as appName } from './app.json';

if (isEngineRnWindows) AppRegistry.registerComponent(appName, () => App); // engine is rn-windows
else ReactDOM.render(React.createElement(App), document.getElementById('root')); // engine is rn-electron
