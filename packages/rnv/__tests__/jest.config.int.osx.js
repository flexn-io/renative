const config = require('./jest.config');

config.testRegex = '\\.intosx\\.js$';
console.log('RUNNING RNV OSX INTEGRATION TESTS');
module.exports = config;
