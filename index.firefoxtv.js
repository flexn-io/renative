import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import Api from './src/api';
import registerServiceWorker from './src/registerServiceWorker';
import { FIREFOX_TV, FORM_FACTOR_TV } from './src/constants';

Api.platform = FIREFOX_TV;
Api.formFactor = FORM_FACTOR_TV;
Api.platformGroup = 'jsapp';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
