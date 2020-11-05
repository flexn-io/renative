const config = require('./jest.config');

config.testRegex = '\\.int.linux\\.js$';
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
