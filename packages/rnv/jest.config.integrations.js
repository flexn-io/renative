const config = require('./jest.config');

config.testRegex = '\\.integration\\.js$';
console.log('RUNNING UNIT/INTEGRATION TESTS');
module.exports = config;
