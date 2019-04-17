import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import Api from './src/api';
import registerServiceWorker from './src/registerServiceWorker';
import { TIZEN, FORM_FACTOR_WATCH } from './src/constants';

Api.platform = TIZEN;
Api.formFactor = FORM_FACTOR_WATCH;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
