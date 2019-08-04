import React from 'react';
import ReactDOM from 'react-dom';
import { Api } from 'renative';
import { TIZEN_MOBILE, FORM_FACTOR_MOBILE, registerServiceWorker } from 'renative';
import App from './src/app';

Api.platform = TIZEN_MOBILE;
Api.formFactor = FORM_FACTOR_MOBILE;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
