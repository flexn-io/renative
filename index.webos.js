import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import Api from './src/api';
import registerServiceWorker from './src/registerServiceWorker';
import { WEBOS, FORM_FACTOR_TV, PLATFORM_GROUP_SMARTTV } from './src/constants';

Api.platform = WEBOS;
Api.formFactor = FORM_FACTOR_TV;
Api.platformGroup = PLATFORM_GROUP_SMARTTV;

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
