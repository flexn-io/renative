const config = require('./jest.config');

config.testRegex = '\\.test\\.js$';
console.log('RUNNING RNV UNIT TESTS');
module.exports = config;
