import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import { Api } from 'renative';
import { KAIOS, FORM_FACTOR_MOBILE, registerServiceWorker } from 'renative';

Api.platform = KAIOS;
Api.formFactor = FORM_FACTOR_MOBILE;
Api.platformGroup = 'jsapp';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
