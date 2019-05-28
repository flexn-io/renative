import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import { Api } from './src/renative';
import { MACOS, FORM_FACTOR_DESKTOP, registerServiceWorker } from './src/renative';

Api.platform = MACOS;
Api.formFactor = FORM_FACTOR_DESKTOP;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
