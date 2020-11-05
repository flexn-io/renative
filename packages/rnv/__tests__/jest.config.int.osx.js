const config = require('./jest.config');

config.testRegex = '\\.int.osx\\.js$';
console.log('RUNNING IOS UNIT/INTEGRATION TESTS');
module.exports = config;
