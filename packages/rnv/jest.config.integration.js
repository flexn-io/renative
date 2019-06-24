const config = require('./jest.config');

config.testRegex = 'integrationtest\\.js$';
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
