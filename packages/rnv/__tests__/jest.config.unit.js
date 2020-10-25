const config = require('./jest.config');

config.testRegex = '\\.test\\.js$';
console.log('RUNNING UNIT TESTS');
module.exports = config;
