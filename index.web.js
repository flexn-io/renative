import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import Api from './src/api';
import registerServiceWorker from './src/registerServiceWorker';
import { WEB, FORM_FACTOR_DESKTOP } from './src/constants';

Api.platform = WEB;
Api.formFactor = FORM_FACTOR_DESKTOP;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
