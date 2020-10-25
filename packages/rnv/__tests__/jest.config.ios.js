const config = require('./jest.config');

config.testRegex = '\\.iostest\\.js$';
console.log('RUNNING IOS UNIT/INTEGRATION TESTS');
module.exports = config;
