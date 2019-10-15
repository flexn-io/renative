import React from 'react';
import ReactDOM from 'react-dom';
import { registerServiceWorker } from 'renative';
import App from './src/app';
import spatialFocus from './src/utils/focus';

spatialFocus();
ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
