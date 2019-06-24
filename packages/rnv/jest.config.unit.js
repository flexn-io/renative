const config = require('./jest.config');

config.testRegex = '\\.test\\.js$';
console.log('RUNNING UNIT/INTEGRATION TESTS');
module.exports = config;
