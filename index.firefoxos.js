import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import { Api } from './src/renative';
import { FIREFOX_OS, FORM_FACTOR_MOBILE, registerServiceWorker } from './src/renative';

Api.platform = FIREFOX_OS;
Api.formFactor = FORM_FACTOR_MOBILE;
Api.platformGroup = 'jsapp';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
