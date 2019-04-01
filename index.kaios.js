import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import Api from './src/api';
import registerServiceWorker from './src/registerServiceWorker';
import { KAIOS, FORM_FACTOR_MOBILE } from './src/constants';

Api.platform = KAIOS;
Api.formFactor = FORM_FACTOR_MOBILE;
Api.platformGroup = 'jsapp';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
