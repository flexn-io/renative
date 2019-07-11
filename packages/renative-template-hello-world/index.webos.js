import React from 'react';
import ReactDOM from 'react-dom';
import { Api } from 'renative';
import { WEBOS, FORM_FACTOR_TV, PLATFORM_GROUP_SMARTTV, registerServiceWorker } from 'renative';
import App from './src/app';
import spatialFocus from './src/utils/focus';

Api.platform = WEBOS;
Api.formFactor = FORM_FACTOR_TV;
Api.platformGroup = PLATFORM_GROUP_SMARTTV;
spatialFocus();
ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
