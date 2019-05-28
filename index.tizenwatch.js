import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import { Api } from './src/renative';
import { TIZEN_WATCH, FORM_FACTOR_WATCH, registerServiceWorker } from './src/renative';

Api.platform = TIZEN_WATCH;
Api.formFactor = FORM_FACTOR_WATCH;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
