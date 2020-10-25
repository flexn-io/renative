const config = require('./jest.config');

config.testRegex = '\\.integration\\.js$';
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
