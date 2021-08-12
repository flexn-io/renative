import React from 'react';
import ReactDOM from 'react-dom';
import { AppRegistry } from 'react-native';
import { isEngineRnMacos } from 'renative';
import App from './src/app';

if(isEngineRnMacos) AppRegistry.registerComponent('App', () => App); // engine is rn-macos
else ReactDOM.render(React.createElement(App), document.getElementById('root')); // engine is rn-electron