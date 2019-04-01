import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import Api from './src/api';
import registerServiceWorker from './src/registerServiceWorker';
import { WINDOWS, FORM_FACTOR_DESKTOP } from './src/constants';

Api.platform = WINDOWS;
Api.formFactor = FORM_FACTOR_DESKTOP;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
