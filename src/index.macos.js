import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import Api from './api';
import registerServiceWorker from './registerServiceWorker';

Api.platform = 'macos';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
