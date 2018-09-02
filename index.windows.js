import React from 'react'
import ReactDOM from 'react-dom'
import App from './src/app'
import registerServiceWorker from './src/registerServiceWorker'

ReactDOM.render(React.createElement(App), document.getElementById('root'))
registerServiceWorker()
