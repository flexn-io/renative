import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/app';
import Api from '../src/api';
import registerServiceWorker from '../src/registerServiceWorker';

Api.platform = 'tizen';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
