import React from 'react';
import ReactDOM from 'react-dom';
import { Api } from 'renative';
import { TIZEN_MOBILE, FORM_FACTOR_WATCH, registerServiceWorker } from 'renative';
import App from './src/app';

Api.platform = TIZEN_MOBILE;
Api.formFactor = FORM_FACTOR_WATCH;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
